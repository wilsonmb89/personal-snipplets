import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { Events, IonicPage, NavController } from 'ionic-angular';
import { SessionProvider } from '../../../../../../providers/authenticator/session';
import { CustomerCard } from '../../../../../../app/models/activation-cards/customer-cards-list-rs';
import { TokenOtpProvider } from '../../../../../../providers/token-otp/token-otp/token-otp';
import { FlowChangeKeysFacade } from '../../../../../../new-app/modules/settings/store/facades/flow-change-keys.facade';
import { CardsInfoFacade } from '@app/modules/settings/store/facades/cards-info.facade';
import { Observable } from 'rxjs/Observable';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { UserFeatures } from '@app/apis/user-features/models/UserFeatures';
import { CreditCardBlockingService } from '@app/modules/products/services/credit-card-blocking.service';
import { take } from 'rxjs/operators';
import { InMemoryKeys } from '../../../../../../providers/storage/in-memory.keys';
import { BdbInMemoryProvider } from '../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { ProductDetail } from 'app/models/products/product-model';

@IonicPage()
@Component({
    selector: 'page-change-keys',
    templateUrl: 'change-keys.html'
})
export class ChangeKeysPage implements OnInit {

    private readonly VALID_IDENTIFICATION_TYPES: string[] = ['CC', 'CE', 'RC', 'NJ', 'PA', 'TI', 'NI', 'NE'];

    listCards: CustomerCard[] = [];
    cardsInfoDebitN$: Observable<CustomerCard[]> = this.cardsInfoFacade.cardsInfoDebitN$;
    cardsInfoCreditN$: Observable<CustomerCard[]> = this.cardsInfoFacade.cardsInfoCreditN$;
    hasSecurePass$: Observable<boolean> = this.cardsInfoFacade.hasSecurePass$;
    private validateCardsByUserSubs: Subscription;
    private selectedCard: CustomerCard;
    private customerProductList: ProductDetail[];
    creditCards$: Observable<CustomerCard[]>;
    showCredit$: Observable<boolean>;
    isblocked = false;
    toogleKeyCC: boolean;


    constructor(
        public navCtrl: NavController,
        private sessionProvider: SessionProvider,
        private events: Events,
        private flowChangeKeysFacade: FlowChangeKeysFacade,
        private tokenOtpProvider: TokenOtpProvider,
        private viewRef: ViewContainerRef,
        private resolver: ComponentFactoryResolver,
        private cardsInfoFacade: CardsInfoFacade,
        private userFacade: UserFacade,
        private creditCardBlockingService: CreditCardBlockingService,
        private bdbInMemoryProvider: BdbInMemoryProvider,
    ) { }

    ngOnInit(): void { }

    ionViewWillEnter(): void {
        this.customerProductList = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.CustomerProductList);
        this.events.publish('srink', true);
        this.validateCardsByUser();
        this.userFacade.userFeatures$
            .pipe(take(1))
            .subscribe((userFeatures: UserFeatures) => {
                this.toogleKeyCC = userFeatures.toggle.allowedServices.setCCPin;
            });
    }

    ionViewWillLeave(): void {
        if (!!this.validateCardsByUserSubs) {
            this.validateCardsByUserSubs.unsubscribe();
        }
        this.events.publish('srink', false);
    }

    private validateCardsByUser(): void {
        this.validateCardsByUserSubs =
            combineLatest(
                this.userFacade.userFeatures$,
                this.cardsInfoDebitN$
            ).subscribe(
                ([userFeature, debitCards]: [UserFeatures, CustomerCard[]]) => {
                    const validIdentificationType = this.checkValidIdentificationTypes(userFeature.customer.identificationType);
                    if (validIdentificationType) {
                        this.listCards = debitCards;
                    }
                }
            );

        this.creditCards$ = this.cardsInfoFacade.cardsActiveCredit$.pipe().
            map(cards => this.creditCardBlockingService.buildProductCreditListCard(cards, this.customerProductList));
        this.showCredit$ = this.creditCards$.pipe().map(list => list.length !== 0);
    }


    public showBlockCreditCardTag(cardState: string): boolean {
        this.isblocked = false;
        if (this.creditCardBlockingService.showBlockCreditCardTagSettings(cardState)) {
            this.isblocked = true;
        }
        return this.creditCardBlockingService.showBlockCreditCardTagSettings(cardState);
    }


    goToFormDebitCard(card: CustomerCard): void {
        this.reduceAllItems();
        this.tokenOtpProvider.requestToken(
            this.viewRef,
            this.resolver,
            () => {
                this.flowChangeKeysFacade.setDebitCardFlowPass(card);
                this.navCtrl.push('FormDebitCardPage');
            }
        );
    }

    public goToFormCreditCard(card: CustomerCard): void {
        this.reduceAllItems();
        this.tokenOtpProvider.requestToken(
            this.viewRef,
            this.resolver,
            () => {
                this.flowChangeKeysFacade.setCreditCardFlowPass(card);
                this.navCtrl.push('CreditCardChangeKeyPage');
            },
            'creditCardActivation');
    }

    goToFormSecurePass(): void {
        this.reduceAllItems();
        this.tokenOtpProvider.requestToken(
            this.viewRef,
            this.resolver,
            () => {
                this.navCtrl.push('FormSecurePassPage');
            }
        );
    }

    private async reduceAllItems(): Promise<any> {
        await customElements.whenDefined('pulse-list');
        const pulseListElements = Array.from(document.querySelectorAll('pulse-list'));
        pulseListElements.forEach(async element => await element.reduceAllItems());
    }

    onBackPage(): void {
        this.navCtrl.push('settings%app');
    }

    logout(): void {
        this.navCtrl.push('authentication/logout');
    }

    private checkValidIdentificationTypes(identificationType: string): boolean {
        return this.VALID_IDENTIFICATION_TYPES.indexOf(identificationType) !== -1;
    }
}

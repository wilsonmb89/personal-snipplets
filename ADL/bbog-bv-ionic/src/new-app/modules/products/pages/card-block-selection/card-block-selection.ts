import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { Component, ComponentFactoryResolver, ViewContainerRef, } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BdbInMemoryProvider } from '../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../../providers/storage/in-memory.keys';
import { BdbModalProvider } from '../../../../../providers/bdb-modal/bdb-modal';
import { SessionProvider } from '../../../../../providers/authenticator/session';
import { DebitCardLockProvider } from '../../../../../providers/debit-card-lock/debit-card-lock';
import { DebitCardLockDelegateService } from '@app/delegate/customer-security-delegate/debit-card-lock-delegate.service';
import { ProductDetail } from 'app/models/products/product-model';
import { CustomerCard } from '../../../../../app/models/activation-cards/customer-cards-list-rs';
import { CardsInfoFacade } from '../../../../modules/settings/store/facades/cards-info.facade';
import { CreditCardFacade } from '@app/shared/store/products/facades/credit-card.facade';
import { CreditCardBlockingService } from '../../../../../new-app/modules/products/services/credit-card-blocking.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { UserFeatures } from '@app/apis/user-features/models/UserFeatures';
import { take } from 'rxjs/operators';

@IonicPage({
  name: 'CardBlockSelectionPage',
  segment: 'card-block-selection'
})
@Component({
  selector: 'card-block-selection-page',
  templateUrl: 'card-block-selection.html',
})
export class CardBlockSelectionPage {
  readonly navTitle = 'Congelar Tarjetas';
  readonly navBack = 'Atrás';
  readonly navExit = 'Salida segura';
  readonly debitCardTitle = 'Tarjetas Débito';
  readonly debitCardDescription = 'Selecciona la tarjeta que deseas congelar.';
  readonly creditCardTitle = 'Tarjetas de Crédito';
  readonly reasonForBlockingText = 'Motivo de congelamiento';
  private readonly CARD_STATE_NORMAL = 'N';
  private creditCardSubscription: Subscription;
  private cardsServiceSubscription: Subscription;
  private selectedCard: CustomerCard;
  private customerProductList: ProductDetail[];
  creditCardDescription: string;
  debitCards$: Observable<CustomerCard[]>;
  creditCards$: Observable<CustomerCard[]>;
  showDebit$: Observable<boolean>;
  showCredit$: Observable<boolean>;
  reasonBlockingList: any[] = [];
  showToggleCreditCard = false;

  constructor(
    private navCtrl: NavController,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private loadingCtrl: LoadingController,
    private sessionProvider: SessionProvider,
    private bdbModal: BdbModalProvider,
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private debitCardLock: DebitCardLockProvider,
    private debitCardLockService: DebitCardLockDelegateService,
    private cardsInfoFacade: CardsInfoFacade,
    private creditCardFacade: CreditCardFacade,
    private creditCardBlockingService: CreditCardBlockingService,
    private pulseToastService: PulseToastService,
    private genericModalService: GenericModalService,
    private userFacade: UserFacade,
  ) { }

  public ionViewWillEnter(): void {
    this.customerProductList = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.CustomerProductList);
    this.fillInfoCards();
    this.creditCardFacade.creditCardActivationReset();
    this.reasonBlockingList = this.debitCardLock.getReasonBlocking();
    this.creditCardDescription = this.creditCardBlockingService.CREDIT_CARD_BLOCK_SETTINGS;
    this.creditCardSubscription = this.creditCardFacade.creditCardActivationState$.subscribe(
      async ccResponse => {
        if (!!ccResponse.blockSuccess || !!ccResponse.unblockSuccess) {
          this.showBlockCard(this.selectedCard, !!ccResponse.blockSuccess);
          this.fillInfoCards();
          await this.pulseToastService.create(this.creditCardBlockingService.getToastCreditCard(!!ccResponse.blockSuccess));
        }
        if (!!ccResponse.blockError || !!ccResponse.unblockError) {
          const genericModalData: GenericModalModel =
            this.creditCardBlockingService.buildModalError(this.navCtrl, this.creditCardFacade);
          this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
        }
      }
    );
    this.userFacade.userFeatures$
          .pipe(take(1))
          .subscribe((userFeatures: UserFeatures) => {
            this.showToggleCreditCard = userFeatures.toggle.allowedServices.toggleTC;
          });
  }

  public ionViewWillLeave(): void {
    if (!!this.creditCardSubscription) {
      this.creditCardFacade.creditCardActivationReset();
      this.creditCardSubscription.unsubscribe();
    }
    if (!!this.cardsServiceSubscription) {
      this.cardsServiceSubscription.unsubscribe();
    }
  }

  private fillInfoCards(): void {
    this.selectedCard = null;

    this.debitCards$ = this.cardsInfoFacade.cardsActiveDebit$.pipe().
      map(cards => this.creditCardBlockingService.buildDebitListCard(cards));
    this.showDebit$ = this.debitCards$.pipe().map(list => list.length !== 0);

    this.creditCards$ = this.cardsInfoFacade.cardsActiveCredit$.pipe().
      map(cards => this.creditCardBlockingService.buildProductCreditListCard(cards, this.customerProductList));
    this.showCredit$ = this.creditCards$.pipe().map(list => list.length !== 0);
  }

  // Credit logic
  public descriptionLockCard(cardState: string): string {
    return this.creditCardBlockingService.getBlockText(cardState, true);
  }

  public showBlockCreditCardButton(cardState: string): boolean {
    return cardState === this.creditCardBlockingService.PREVENTIVE_BY_OFFICE;
  }

  public showUnblockButton(cardState: string): boolean {
    return cardState === this.creditCardBlockingService.PREVENTIVE_BY_OFFICE || cardState === '';
  }

  public showBlockCreditCardTag(cardState: string): boolean {
    return this.creditCardBlockingService.showBlockCreditCardTagSettings(cardState);
  }

  public confirmCreditCardBlock(blocking: boolean, card: CustomerCard): void {
    const genericModalData: GenericModalModel =
      this.creditCardBlockingService.buildModalData(blocking, card.cardNumber, this.creditCardFacade);
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
    this.selectedCard = card;
  }

  public selectCreditCard(card: CustomerCard): void {
    const tempProd = this.customerProductList.find(t => t.productNumberApi === card.cardNumber);
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.CustomerProductList, this.customerProductList);
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ProductDetail, tempProd);
    this.navCtrl.push('DetailAndTxhistoryPage', null, {
      animate: true,
      animation: 'ios-transition'
    });
  }

  private showBlockCard(card: CustomerCard, blocking: boolean): void {
    this.cardsServiceSubscription = this.creditCards$.subscribe(
      cards => {
        const modCard = cards.find(cardObs => cardObs.cardNumber === card.cardNumber);
        modCard.lockId = blocking ? this.creditCardBlockingService.PREVENTIVE_BY_OFFICE : '';
        return modCard;
      }
    );
  }

  // Debit logic
  public lockDebitCardItem(cardState: string): boolean {
    return cardState === this.CARD_STATE_NORMAL;
  }

  public showTagDebitCard(cardState: string): string {
    return cardState !== this.CARD_STATE_NORMAL ? 'Congelada' : '';
  }

  public changeDropDownDebitCard(target: any, card: CustomerCard): void {
    const reasonBlocking = this.debitCardLock.getItemReasonBlocking(target.value);
    this.bdbModal.launchErrModal(
      reasonBlocking.value,
      reasonBlocking.info,
      'Cancelar',
      async (e) => {
        if (e === 'Congelar') {
          this.callDebitCardLockService(card.cardNumber, reasonBlocking.refType);
        }
        target.text = null;
      },
      'Congelar'
    );
  }

  private callDebitCardLockService(acctId: string, secretId: string): void {
    const load = this.loadingCtrl.create();
    load.present();
    this.debitCardLockService.debitCardLock(
      acctId,
      secretId
    ).subscribe(
      res => {
        load.dismiss();
        this.cardsInfoFacade.fetchCardsInfo();
        this.navCtrl.setRoot('DashboardPage');
      },
      err => {
        load.dismiss();
         this.bdbModal.launchErrModal(
           'Ha ocurrido un error',
           'Intenta más tarde por favor.',
           'Aceptar'
        );
      }
    );
  }

  public secureExit(): void {
    this.navCtrl.push('authentication/logout');
  }
}

import { IonicPage, NavController, Events } from 'ionic-angular';
import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { BdbInMemoryProvider } from '../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { CustomerCard } from '../../../../../app/models/activation-cards/customer-cards-list-rs';
import { InMemoryKeys } from '../../../../../providers/storage/in-memory.keys';
import { CardsInfoFacade } from '../../../../modules/settings/store/facades/cards-info.facade';
import { Observable } from 'rxjs/Observable';
import { TokenOtpProvider } from '../../../../../providers/token-otp/token-otp/token-otp';
import { CreditCardFacade } from '../../../../shared/store/products/facades/credit-card.facade';
import { CreditCardAccountInfoRq } from '@app/apis/customer-security/models/creditCardAccountInfo';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { Subscription } from 'rxjs/Subscription';
import { CreditCardBlockingService } from '../../services/credit-card-blocking.service';

@IonicPage({
  name: 'CardSelectionPage',
  segment: 'card-selection'
})
@Component({
  selector: 'card-selection-page',
  templateUrl: 'card-selection.html',
})
export class CardSelectionPage implements OnInit {
  private cardActivationSubscription: Subscription;
  readonly navTitle = 'Activación de tarjetas';
  debitCards$: Observable<CustomerCard[]>;
  creditCards$: Observable<CustomerCard[]>;
  showDebit$: Observable<boolean>;
  showCredit$: Observable<boolean>;

  constructor(
    private navCtrl: NavController,
    private events: Events,
    private bdbInMemory: BdbInMemoryProvider,
    private cardsInfoFacade: CardsInfoFacade,
    private tokenOtp: TokenOtpProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private creditCardFacade: CreditCardFacade,
    private genericModalService: GenericModalService,
    private creditCardBlockingService: CreditCardBlockingService
  ) { }

  public ngOnInit(): void {
    this.debitCards$ = this.cardsInfoFacade.cardsPendingDebit$.pipe().
      map(cards => this.creditCardBlockingService.buildDebitListCard(cards));
    this.creditCards$ = this.cardsInfoFacade.cardsPendingCredit$.pipe().
      map(cards => this.creditCardBlockingService.buildCreditListCard(cards));
    this.showDebit$ = this.debitCards$.pipe().map(list => list.length !== 0);
    this.showCredit$ = this.creditCards$.pipe().map(list => list.length !== 0);
  }

  public ionViewWillEnter(): void {
    this.events.publish('srink', true);
  }

  public ionViewWillLeave(): void {
    if (this.cardActivationSubscription) {
      this.cardActivationSubscription.unsubscribe();
    }
  }

  private callATCToken() {
    this.cardActivationSubscription.unsubscribe();
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
        this.navCtrl.push('CardActivationPage');
      },
      'creditCardActivation');
  }

  public selectCard(card: CustomerCard): void {
    if (card.cardType === 'DEB') {
      this.bdbInMemory.setItemByKey(InMemoryKeys.ActivationCard, card);
      this.bdbInMemory.setItemByKey(InMemoryKeys.ValidateNumberCard, card.lastDigits);
      this.navCtrl.push('debit-card-number');
    }
    if (card.cardType === 'CRE') {
      this.creditCardFacade.creditCardActivationReset();
      const cardAccountInfoRq: CreditCardAccountInfoRq = {
        cardId: card.cardNumber
      };
      this.creditCardFacade.creditCardAccountInfo(cardAccountInfoRq);
      this.cardActivationSubscription = this.creditCardFacade.creditCardActivationState$.subscribe(
        cca => {
          if (!!cca.accountInfoSuccess) {
            if (cca.accountInfoSuccess.cardStatusCode === 'N') {
              this.showModalActivate(
                'Tu tarjeta ya está activa ',
                'Recuerda que desde mañana podrás ver todos los movimientos de tu tarjeta.'
              );
            } else {
              this.activateCard(card);
            }
          }
        }
      );
    }
  }

  private activateCard(card: CustomerCard): void {
    this.bdbInMemory.setItemByKey(InMemoryKeys.ActivationCard, card);
    this.bdbInMemory.setItemByKey(InMemoryKeys.ValidateNumberCard, card.lastDigits);
    this.callATCToken();
  }

  public onBackPressed(): void {
    if (this.navCtrl.canGoBack()) {
      this.events.publish('srink', false);
      this.navCtrl.pop();
    } else {
      this.navCtrl.setRoot('DashboardPage');
    }
  }

  private showModalActivate(title: string, messageError: string): void {
    this.creditCardFacade.creditCardActivationReset();
    const genericModalData: GenericModalModel = {
      icon: {
        src: 'assets/imgs/payments/message-img.svg',
        alt: 'error'
      },
      modalTitle: title,
      modalInfoData: `<span>${messageError}</span>`,
      actionButtons: [{
        id: 'generic-btn-action-1',
        buttonText: 'Entendido',
        block: true,
        colorgradient: true,
        action: () => {
          this.cardActivationSubscription.unsubscribe();
        },
      }]
    };
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

}

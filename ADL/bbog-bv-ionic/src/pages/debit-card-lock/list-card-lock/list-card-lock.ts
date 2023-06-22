import { Component, ComponentFactoryResolver, OnDestroy, ViewContainerRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Events, PopoverController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { CardSecurity } from '../../../app/models/card-security/card-security-list-rs';
import { BdbMap } from '../../../app/models/bdb-generics/bdb-map';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { CardSecurityProvider } from '../../../providers/card-security/card-security';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { MobileSummaryProvider } from '../../../components/mobile-summary';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { BdbConstants } from '../../../app/models/bdb-generics/bdb-constants';
import { DebitCardLockProvider } from '../../../providers/debit-card-lock/debit-card-lock';
import { BdbModalProvider } from '../../../providers/bdb-modal/bdb-modal';
import { CardsInfoFacade } from '../../../new-app/modules/settings/store/facades/cards-info.facade';
import { DebitCardLockDelegateService } from '@app/delegate/customer-security-delegate/debit-card-lock-delegate.service';
import {
  ServiceApiErrorModalService
} from '@app/shared/components/modals/service-api-error-modal/provider/service-api-error-modal.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';

@IonicPage()
@Component({
  selector: 'page-list-card-lock',
  templateUrl: 'list-card-lock.html',
})
export class ListCardLockPage implements OnDestroy {

  title: string;
  subtitle: string;
  abandonText: string;
  validCardSecurityForm = false;
  listCards: Array<CardSecurity>;
  cardSecurityForm: FormGroup;
  listCardsForm: FormArray;
  reasonBlockingList: Array<Array<BdbMap>> = [];
  CARD_STATE_NORMAL = 'N';
  cardsInfoSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private bdbInMemory: BdbInMemoryProvider,
    private formBuilder: FormBuilder,
    private cardSecurity: CardSecurityProvider,
    private bdbPlatforms: BdbPlatformsProvider,
    private mobileSummary: MobileSummaryProvider,
    public popoverCtrl: PopoverController,
    private debitCardLock: DebitCardLockProvider,
    private loadingCtrl: LoadingController,
    private bdbModal: BdbModalProvider,
    private cardsInfoFacade: CardsInfoFacade,
    private debitCardLockService: DebitCardLockDelegateService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private serviceApiErrorModalService: ServiceApiErrorModalService,
  ) {

    this.title = 'Bloqueo tarjetas débito';
    this.subtitle = 'Selecciona el bloqueo de tus tarjetas débito.';
    this.abandonText = 'Abandonar';

    this.cardSecurityForm = this.formBuilder.group({
      listCardsForm: this.formBuilder.array([])
    });

    this.listCardsForm = this.cardSecurityForm.get('listCardsForm') as FormArray;
    this.listCards = this.getListCards(this.bdbInMemory.getItemByKey(InMemoryKeys.ListCardLock));
    this.mapFormControls();
  }

  ngOnDestroy() {
    if (!!this.cardsInfoSubscription) {
      this.cardsInfoSubscription.unsubscribe();
    }
  }

  ionViewDidLoad() {
  }

  getListCards(lisMem): Array<CardSecurity> {
    lisMem = (!!lisMem) ? lisMem : [];
    return lisMem.map(this.mapList());
  }

  ionViewWillEnter() {
    this.cardsInfoFacade.fetchCardsInfo();
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);
    this.getCustomerCardsStore();
    this.events.publish('header:title', this.title);
  }

  mapList() {
    return (e: any, index) => {
      e.nameCard = 'Tarjeta Débito';
      e.logoPath = BdbConstants.BBOG_LOGO_WHITE;
      e.displayNumber = `${e.displayNumber}`;
      e.active = index === 0 && e.cardState === this.CARD_STATE_NORMAL;
      return e;
    };
  }

  mapFormControls() {
    this.listCards.forEach((e, index) => {
      this.listCardsForm.push(this.createItem());
      this.reasonBlockingList.push(this.debitCardLock.getReasonBlocking());
      const group = this.listCardsForm.controls[index] as FormGroup;
      group.controls.reasonBlocking.valueChanges.subscribe(
        this.debitCardLock.changeGroup(
          index,
          group,
          this.myCallbackFunction,
          null
        )
      );
    });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      reasonBlocking: ['', [Validators.required]]
    });
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  myCallbackFunction = (_params) => {
    return new Promise<void>((resolve, reject) => {
      const load = this.loadingCtrl.create();
      load.present().then(() => {
        const reasonBlocking = this.debitCardLock.getItemReasonBlocking(_params.reasonBlocking);
        this.debitCardLockService.debitCardLock(
          this.listCards[_params.index].cardNumber,
          reasonBlocking.refType
        ).subscribe(
          res => {
            load.dismiss();
            this.successLockOperation(resolve, reject);
          },
          (ex) => {
            load.dismiss();
            const errorData: ApiGatewayError = ex.error ? ex.error : null;
            this.serviceApiErrorModalService.launchErrorModal(
              this.viewRef,
              this.resolver,
              !!errorData ? errorData.customerErrorMessage : null
            );
            resolve();
          }
        );
      });
    });
  }

  selectCard(item: any, index: number) {

    if (!this.bdbPlatforms.isBrowser()) {

      const group = this.listCardsForm.controls[index] as FormGroup;

      this.cardSecurity.setUpMobileSummary(item);
      this.navCtrl.push('EditCardLockPage', {
        item,
        index,
        reasonBlocking: group.controls.reasonBlocking.value,
        callback: this.myCallbackFunction
      }, {
          animation: 'ios'
        });

    } else {

      this.listCards.filter(e => e !== item).forEach(e => {
        e.active = false;
      });
      item.active = !item.active;
    }
  }

  private successLockOperation(resolve: any, reject: any): void {
    this.cardsInfoFacade.refreshCardsInfo();
    this.navCtrl.setRoot('DashboardPage');
    resolve();
  }

  private getCustomerCardsStore(): void {
    const load = this.loadingCtrl.create();
    load.present().then(() => {
      this.cardsInfoSubscription = this.cardsInfoFacade.cardsInfoState$.subscribe(
        cardsInfoState => {
          this.listCards = [];
          this.bdbInMemory.setItemByKey(InMemoryKeys.ListCardLock, []);
          if (!cardsInfoState.working) {
            const customerCards = cardsInfoState.customerCardList;
            if (cardsInfoState.completed && !!customerCards && customerCards.length > 0) {
              this.listCards = this.getListCards(customerCards.filter(e => e.cardType === 'DEB' && e.cardState !== 'E'));
              this.bdbInMemory.setItemByKey(InMemoryKeys.ListCardLock, this.listCards);
            }
          } else if (!!cardsInfoState.error) {
            const ex = cardsInfoState.error;
            const errorData: ApiGatewayError = ex.error ? ex.error : null;
            this.serviceApiErrorModalService.launchErrorModal(
              this.viewRef,
              this.resolver,
              !!errorData ? errorData.customerErrorMessage : null
            );
          }
          load.dismiss();
        }
      );
    });
  }
}

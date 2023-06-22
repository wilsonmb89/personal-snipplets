import {Component, OnInit, ViewContainerRef, ComponentFactoryResolver, ViewChild, OnDestroy} from '@angular/core';
import {Events, LoadingController, NavController} from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BalanceStatus, BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { AccountAny } from '../../../../app/models/enrolled-transfer/account-any';
import { AccountBalance } from '../../../../app/models/enrolled-transfer/account-balance';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { CreditCardPaymentInfo } from '../../../../app/models/tc-payments/credit-card-payment-info';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { SessionProvider } from '../../../../providers/authenticator/session';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../../../providers/bdb-mask/bdb-mask-type.enum';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { BdbToastProvider } from '../../../../providers/bdb-toast/bdb-toast';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { CreditCardOpsProvider } from '../../../../providers/credit-card-ops/credit-card-ops';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { UnknownBalanceProvider } from '../../../../providers/unknown-balance/unknown-balance';
import { TokenOtpProvider } from '../../../../providers/token-otp/token-otp/token-otp';
import { Observable } from 'rxjs/Observable';
import { CCObligationsFacade } from '../../../../new-app/modules/payments/store/facades/cc-obligations.facade';
import {BdbItemCardModel} from '../../../../components/bdb-item-card-v2/bdb-item-card-v2';
import {GenericModalModel} from '../../../../new-app/shared/components/modals/generic-modal/model/generic-modal.model';
import {GenericModalService} from '../../../../new-app/shared/components/modals/generic-modal/provider/generic-modal.service';
import {DeleteObligationService} from '../../../../new-app/modules/payments/services/delete-obligations.service';
import {PulseToastService} from '../../../../new-app/shared/components/pulse-toast/provider/pulse-toast.service';
import {PulseToastOptions} from '../../../../new-app/shared/components/pulse-toast/model/generic-toast.model';

export interface CardCCObligation {
  contraction: string;
  cardTitle: string;
  cardDesc: string[];
  cardSubDesc: string[];
  creditCard: AccountBalance;
}

@PageTrack({ title: 'cc-destination-acct' })
@Component({
  selector: 'page-cc-destination-acct',
  templateUrl: 'cc-destination-acct.html'
})
export class CCDestinationAcctPage implements OnInit {

  title = 'Pago de Tarjetas de Crédito';
  subtitle = '¿Cuál tarjeta vas a pagar?';
  abandonText = BdbConstants.ABANDON_PAY;
  showBalanceLoader = true;
  logoPath: string;
  isModalOpen = false;
  itemCards: Array<{ cardTitle, cardDesc, cardSubDesc, creditCard: any }> = [];
  enrolledItemCards: Array<{ contraction, cardTitle, cardDesc, cardSubDesc, creditCard }> = [];
  @ViewChild('ppalContainer') ppalContainer;

  dataEmpty = {
    img: {
      desktop: 'empty-states/inscreditcard.svg',
      mobile: 'empty-states/inscreditcard.svg'
    },
    message: 'Inscribe Tarjetas de Crédito de cualquier Banco y pagalas en pocos pasos.',
    button: {
      message: 'Inscribir tarjeta',
      callback: () => {
        this.enrollCC();
      }
    }
  };

  private _cards = this.funnelKeysProvider.getKeys().cards;
  private _funnelEnroll = this.funnelKeysProvider.getKeys().enrollCreditCards;

  cardsCCObligations$: Observable<BdbItemCardModel[]> = this.ccObligationsFacade.cardsCCObligations$
    .map(ccObligation => ccObligation.map( v => this.mapToItemCardModelEnrolled(v)));
  ccObligationsWorking$: Observable<boolean> = this.ccObligationsFacade.ccObligationsWorking$;
  ccObligationsCompleted$: Observable<boolean> = this.ccObligationsFacade.ccObligationsCompleted$;

  constructor(
    public navCtrl: NavController,
    private bdbInMemory: BdbInMemoryProvider,
    private progressBar: ProgressBarProvider,
    private bdbUtils: BdbUtilsProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private session: SessionProvider,
    private accessDetail: AccessDetailProvider,
    private mobileSummary: MobileSummaryProvider,
    private bdbModal: BdbModalProvider,
    private creditCardOps: CreditCardOpsProvider,
    private tokenOtp: TokenOtpProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private bdbMask: BdbMaskProvider,
    private bdbToast: BdbToastProvider,
    private events: Events,
    private unknownBalance: UnknownBalanceProvider,
    private ccObligationsFacade: CCObligationsFacade,
    private genericModalService: GenericModalService,
    private loadingCtrl: LoadingController,
    private deleteObligationService: DeleteObligationService,
    private pulseToastService: PulseToastService
  ) {
    this.bdbInMemory.setItemByKey(InMemoryKeys.PaymentOrigin, 'cc');
    this.logoPath = BdbConstants.BBOG_LOGO_WHITE;
  }

  ngOnInit() {
    this.itemCards = [];
    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Tarjeta de Crédito');
    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);

    const customerProducts: Array<ProductDetail> = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (!!customerProducts) {
      this.setCreditCards(customerProducts);
    }
    this.getCreditCardsEnroll();
    this.events.publish('header:btn:remove', 'left');
  }

  getCreditCardsEnroll() {
    this.ccObligationsFacade.fetchCCObligations();
  }

  setCreditCards(customerProducts: Array<ProductDetail>) {
    this.itemCards = [];
    const credCards = customerProducts.filter(e => {
      return e.category === BdbConstants.TARJETA_CREDITO_BBOG;
    });

    this.showBalanceLoader = true;

    this.unknownBalance.loadAccountBalances(credCards, (balanceStatus) => {
      if (balanceStatus === BalanceStatus.FINISHED) {
        this.showBalanceLoader = false;
        this.mapCards(credCards);
      } else if (balanceStatus === BalanceStatus.FINISHED_WITH_ERROR) {
        this.showBalanceLoader = false;
        this.mapCards(credCards);
        this.bdbToast.showToastGeneric({
          message: 'Algunas de tus tarjetas no pudieron ser consultadas',
          close: true,
          color: 'toast-error',
          type: 'delete'
        });
      }
    });
  }

  mapCards(credCards: ProductDetail[]) {
    credCards.forEach((f: ProductDetail) => {
      if (f.balanceDetail && f.balanceDetail !== {}) {
        this.mapBdbItemCard(f);
      }
    });
  }

  mapBdbItemCard(ccd: ProductDetail) {
    let info: string;
    if (ccd.balanceDetail.fecProxPagoBBOG) {
      info = `${BdbConstants.namedMap.fecProxPagoBBOG.label}:
      ${this.bdbMask.maskFormatFactory(ccd.balanceDetail.fecProxPagoBBOG, MaskType.DATE)}`;
    }
    const tempCard = {
      cardTitle: ccd.productName,
      cardDesc: [
        `${ccd.franchise} ${ccd.productNumber}`
      ],
      cardSubDesc: [
        info
      ],
      creditCard: ccd
    };
    this.itemCards.push(tempCard);
  }

  triggerAmmtInput(credit: ProductDetail) {
    this.funnelEventsProvider.callFunnel(this._cards, this._cards.steps.pickCard);
    const creditCard: AccountAny = new AccountAny(true, credit, null);
    this.saveKey(creditCard);
    this.navCtrl.push('creditcard%amount%select');
  }

  triggerAmmtInputEnroll(account: AccountBalance) {
    this.funnelEventsProvider.callFunnel(this._cards, this._cards.steps.pickCard);
    const enrolledCreditCard: AccountAny = new AccountAny(false, null, account);
    this.saveKey(enrolledCreditCard);
    this.navCtrl.push('creditcard%enrolled%amount');
  }

  saveKey(creditCard: AccountAny) {
    const ccPaymentInfo: CreditCardPaymentInfo = new CreditCardPaymentInfo();
    ccPaymentInfo.creditCard = creditCard;
    ccPaymentInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    this.bdbInMemory.setItemByKey(InMemoryKeys.CreditCardInfo, ccPaymentInfo);
  }

  getColor(index: number): string {
    return this.bdbUtils.getRandomColor(index);
  }

  enrollCC() {
    this.funnelEventsProvider.callFunnel(this._funnelEnroll, this._funnelEnroll.steps.pickEnroll);
    this.checkToken();
  }

  checkToken() {
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
            this.navCtrl.push('subscribe%obl%creditcard');
      },
      'creditCardInscription');
  }

  ionViewCanEnter() {
    return this.session.authenticated();
  }

  onContextSelection(event, account: AccountBalance) {
    if (event.key === 'delete') {
      this.launchErrorModal(
        'assets/imgs/generic-modal/icon-delete-warning.svg',
        'Eliminar Tarjeta de Crédito',
        '¿Estás seguro de eliminar esta tarjeta inscrita?',
        'Cancelar',
        'Si, eliminar',
        () => {
          this.isModalOpen = false;
        },
        () => {
          this.deleteEnrolledCreditCard(account);
        }
      );
    }
  }

  private mapToItemCardModelEnrolled(cardsCCObligation: CardCCObligation): BdbItemCardModel {
    return {
      title: cardsCCObligation.cardTitle,
      desc: [
        ...cardsCCObligation.cardDesc,
        ...cardsCCObligation.cardSubDesc.map(this.bdbUtils.toCamelCase),
      ],
      product: cardsCCObligation.creditCard,
      contraction: cardsCCObligation.contraction,
      contextMenuList: [ {key: 'delete', value: 'Eliminar Tarjeta', color: 'error', icon: 'bin-1', colorvariant: '700', showIcon: true}],
      withContextMenu: true
    };
  }

  private launchErrorModal(
    imgSrcPath: string,
    title: string,
    description: string,
    actionText: string,
    actionText_2: string,
    actionModal: () => void,
    actionModal2,
  ): void {
    const genericModalData: GenericModalModel = {
      icon: {
        src: imgSrcPath,
        alt: 'warning'
      },
      modalTitle: title,
      modalInfoData: `<span>${description}</span>`,
      actionButtons: [
        {
          id: 'generic-btn-action-1',
          buttonText: actionText,
          block: true,
          colorgradient: false,
          action: actionModal
        },
        {
          id: 'generic-btn-action-2',
          buttonText: actionText_2,
          block: true,
          colorgradient: true,
          action: actionModal2,
        }
      ]
    };
    this.isModalOpen = true;
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

  private deleteEnrolledCreditCard(account: AccountBalance) {
    const loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.deleteObligationService.deleteObligations(this.deleteObligationService.mapDeleteObligation(account)).subscribe(async () => {
        this.ccObligationsFacade.updateCCObligations();
        loader.dismiss();

        const opts: PulseToastOptions = {
          text: 'El producto se ha eliminado correctamente',
          color: 'success',
          colorvariant: '100',
          image : 'assets/imgs/pulse-toast/toast-delete.svg',
          closeable : true,
        };
        await this.pulseToastService.create(opts);
      }, async () => {
        loader.dismiss();
        const opts: PulseToastOptions = {
          text: 'Error al eliminar el producto. Intenta más tarde.',
          color: 'error',
          colorvariant: '100',
          image : 'assets/imgs/pulse-toast/toast-warning.svg',
          closeable : true
        };
        await this.pulseToastService.create(opts);
      });
    });
  }

}

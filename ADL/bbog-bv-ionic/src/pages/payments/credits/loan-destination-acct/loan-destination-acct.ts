import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import {Events, LoadingController, NavController, NavParams} from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BalanceStatus, BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { LoanPaymentInfo } from '../../../../app/models/credits/loan-payment-info';
import { AccountAny } from '../../../../app/models/enrolled-transfer/account-any';
import { AccountBalance } from '../../../../app/models/enrolled-transfer/account-balance';
import { mapDetailsBalance, ProductDetail } from '../../../../app/models/products/product-model';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { AvalOpsProvider } from '../../../../providers/aval-ops/aval-ops';
import { GetBalancesByAccountRs } from '../../../../providers/aval-ops/aval-ops-models';
import { BalanceUtilsProvider } from '../../../../providers/balance-utils/balance-utils';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { BdbToastProvider } from '../../../../providers/bdb-toast/bdb-toast';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { EnrollProvider } from '../../../../providers/enroll/enroll';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { LoanOpsProvider } from '../../../../providers/loan-ops/loan-ops';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { PaymentsProvider } from '../../../../providers/payments/payments';
import { TokenOtpProvider } from '../../../../providers/token-otp/token-otp/token-otp';
import { Observable } from 'rxjs/Observable';
import { AcObligationsFacade } from '../../../../new-app/modules/payments/store/facades/ac-obligations.facade';
import { CardACObligation } from '../../../../new-app/modules/payments/store/selectors/ac-obligations.selector';
import {CatalogsEnum} from '../../../../new-app/core/services-delegate/list-parameters/enums/catalogs-enum';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';
import {BdbItemCardModel} from '../../../../components/bdb-item-card-v2/bdb-item-card-v2';
import {GenericModalModel} from '../../../../new-app/shared/components/modals/generic-modal/model/generic-modal.model';
import {GenericModalService} from '../../../../new-app/shared/components/modals/generic-modal/provider/generic-modal.service';
import {DeleteObligationService} from '../../../../new-app/modules/payments/services/delete-obligations.service';
import {PulseToastOptions} from '../../../../new-app/shared/components/pulse-toast/model/generic-toast.model';
import {PulseToastService} from '../../../../new-app/shared/components/pulse-toast/provider/pulse-toast.service';
import {ExtraordinaryPaymentService} from '@app/modules/payments/services/extraordinary-payment.service';


@PageTrack({title: 'loan-destination-acct'})
@Component({
  selector: 'page-loan-destination-acct',
  templateUrl: 'loan-destination-acct.html',
})
export class LoanDestinationAcctPage implements OnInit {

  title = 'Pago de Créditos';
  subtitle = '¿Cuál crédito vas a pagar?';
  abandonText = BdbConstants.ABANDON_PAY;
  credits: Array<CardACObligation> = [];
  showBalanceLoader = false;
  enrolledCredits: Array<CardACObligation> = [];
  isModalOpen = false;
  logoPath: string;
  dataEmpty = {
    img: {
      desktop: 'empty-states/credits.svg',
      mobile: 'empty-states/credits.svg'
    },
    message: 'Inscribe Créditos de cualquier Banco del Grupo AVAL y paga sin salir de casa.',
    button: {
      message: 'Inscribir crédito',
      callback: () => {
        this.enrollCredits();
      }
    }
  };
  private _credits = this.funnelKeysProvider.getKeys().credits;
  private _enrollCredits = this.funnelKeysProvider.getKeys().enrollCredits;

  public enrolledCredits$: Observable<BdbItemCardModel[]>;

  public workingEnrolledCredits$: Observable<boolean>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private progressBar: ProgressBarProvider,
    private bdbUtils: BdbUtilsProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private enrollProvider: EnrollProvider,
    private accessDetail: AccessDetailProvider,
    private bdbMask: BdbMaskProvider,
    private loanOps: LoanOpsProvider,
    private loading: LoadingController,
    private bdbModal: BdbModalProvider,
    private avalOps: AvalOpsProvider,
    private balanceUtils: BalanceUtilsProvider,
    private bdbToast: BdbToastProvider,
    private events: Events,
    private tokenOtp: TokenOtpProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private paymentsProvider: PaymentsProvider,
    private avalCreditObligationsFacade: AcObligationsFacade,
    private userFacade: UserFacade,
    private genericModalService: GenericModalService,
    private loadingCtrl: LoadingController,
    private deleteObligationService: DeleteObligationService,
    private pulseToastService: PulseToastService,
    private extraordinaryPaymentService: ExtraordinaryPaymentService
  ) {
    // TODO no usar las llaves del sessionStorage para definir el flujo de la navegación
    this.bdbInMemory.setItemByKey(InMemoryKeys.PaymentOrigin, 'credit');
    this.logoPath = BdbConstants.BBOG_LOGO_WHITE;
  }

  ngOnInit() {
    const customerProducts: Array<ProductDetail> = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (customerProducts) {
      this.setCredits(customerProducts);
    }

    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Crédito');
    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }
    this.events.publish('header:btn:remove', 'left');

    this.avalCreditObligationsFacade.fetchAvalCreditsObligations();

    this.enrolledCredits$ = this.avalCreditObligationsFacade.cardsAcObligations$
    .map(acObligation => acObligation.map( v => this.mapToItemCreditModelEnrolled(v)));

    this.workingEnrolledCredits$ = this.avalCreditObligationsFacade.acObligationsWorking$;

    this.userFacade.getCatalogue(CatalogsEnum.CREDITOS_AVAL);
  }


  setCredits(customerProducts: Array<ProductDetail>) {
    this.credits = [];
    const filteredCredits = customerProducts.filter(e => e.category === BdbConstants.CREDITOS_BBOG);
    let counterSuccess = 0;
    let counterError = 0;
    const arrayLength = filteredCredits.length;

    filteredCredits.forEach((e: ProductDetail) => {
      if (e.balanceDetail && e.balanceDetail !== {}) {
        counterSuccess++;
        this.monitorBalances(counterSuccess, counterError, arrayLength);
        this.mapBdbItemCard(e);
      } else {
        this.showBalanceLoader = true;
        this.avalOps.getBalancesByAccount(e).subscribe(
          (data: GetBalancesByAccountRs) => {
            counterSuccess++;
            this.monitorBalances(counterSuccess, counterError, arrayLength);
            e.balanceDetail = mapDetailsBalance(data.details);
            this.mapBdbItemCard(e);
            this.bdbInMemory.setItemByKey(InMemoryKeys.CustomerProductList, customerProducts);
          },
          (err) => {
            counterError++;
            this.monitorBalances(counterSuccess, counterError, arrayLength);
          }
        );
      }
    });
  }

  mapBdbItemCard(ccd: ProductDetail) {
    let tempCard;
    const propertyToShow = this.bdbUtils.mapPaymentProperty(ccd.productType);
    if (propertyToShow) {
      if (ccd.balanceDetail[propertyToShow[0]] && propertyToShow.length > 1) {
        tempCard = {
          cardTitle: ccd.productName,
          cardDesc: [
            `No. ${ccd.productNumber}`,
            `${BdbConstants.namedMap[propertyToShow[0]].label}
                ${this.bdbMask.maskFormatFactory(ccd.balanceDetail[propertyToShow[0]],
              BdbConstants.namedMap[propertyToShow[0]].format)}`
          ],
          cardSubDesc: [
            `${BdbConstants.namedMap[propertyToShow[1]].label}
                ${this.bdbMask.maskFormatFactory(ccd.balanceDetail[propertyToShow[1]],
              BdbConstants.namedMap[propertyToShow[1]].format)}`
          ],
          credit: ccd
        };
        this.credits.push(tempCard);
      } else if (ccd.balanceDetail[propertyToShow[0]]) {
        tempCard = {
          cardTitle: ccd.productName,
          cardDesc: [
            `No. ${ccd.productNumber}`,
            `${BdbConstants.namedMap[propertyToShow[0]].label}
                ${this.bdbMask.maskFormatFactory(ccd.balanceDetail[propertyToShow[0]],
              BdbConstants.namedMap[propertyToShow[0]].format)}`
          ],
          credit: ccd
        };
        this.credits.push(tempCard);
      }
    }
  }

  async resolveBalances(balanceStatus: BalanceStatus) {
    if (balanceStatus === BalanceStatus.FINISHED) {
      this.showBalanceLoader = false;
    } else if (balanceStatus === BalanceStatus.FINISHED_WITH_ERROR) {
      this.showBalanceLoader = false;
      this.bdbToast.showToastGeneric({
        message: 'Algunos de tus productos no pudieron ser consultados',
        close: true,
        color: 'toast-error',
        type: 'delete'
      });
    }
  }


  monitorBalances(counterSuccess: number, counterError: number, arrayLength: number) {
    this.resolveBalances(this.balanceUtils.checkBalanceInquiryStatus(counterSuccess, counterError, arrayLength));
  }

  triggerAmmtInput(credit: ProductDetail) {
    this.funnelEventsProvider.callFunnel(this._credits, this._credits.steps.pickCredit);
    this.launchNext(credit);
  }

  triggerAmmtInputEnroll(account: AccountBalance) {
    this.funnelEventsProvider.callFunnel(this._credits, this._credits.steps.pickCredit);
    const mLoan: AccountAny = new AccountAny(false, null, account);
    const loanPaymentInfo: LoanPaymentInfo = new LoanPaymentInfo();
    loanPaymentInfo.loan = mLoan;
    loanPaymentInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    this.bdbInMemory.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);
    this.events.publish('srink', true);
    this.navCtrl.push('EnrolledAmountCreditsPage');
  }

  launchNext(loan: ProductDetail) {
    const loanPaymentInfo: LoanPaymentInfo = new LoanPaymentInfo();
    const mLoan = new AccountAny(true, loan, null);
    loanPaymentInfo.loan = mLoan;
    loanPaymentInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    const loader = this.loading.create();
    loader.present();
    // TO DO: unsubscribe from services
    this.extraordinaryPaymentService.checkExtraPayment('loanDestinationAcct', loanPaymentInfo)
      .subscribe({
        next: res => {
          loanPaymentInfo.loan.accountOwned.hasAdvancePmnt = res.status === '1';
          this.bdbInMemory.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);
          this.events.publish('srink', true);
          this.navCtrl.push('credit%amount%select', {flag: 'loanDestinationAcct'});
        }, error:
          error => {
            this.bdbInMemory.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);
            loader.dismiss();
            this.events.publish('srink', true);
            this.navCtrl.push('credit%amount%select', {flag: 'loanDestinationAcct'});
          },
        complete: () => {
          loader.dismiss();
        }
      });
  }

  getColor(index: number): string {
    return this.bdbUtils.getRandomColor(index);
  }

  enrollCredits() {
    this.funnelEventsProvider.callFunnel(this._enrollCredits, this._enrollCredits.steps.pickEnroll);
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
          this.navCtrl.push('subscribe%obl%credits');
      },
      'creditInscription');
  }

  onContextSelection(event, loan: AccountBalance) {
    if (event.key === 'delete') {
      this.launchErrorModal(
        'assets/imgs/generic-modal/icon-delete-warning.svg',
        'Eliminar Crédito',
        '¿Estás seguro de eliminar este crédito inscrito?',
        'Cancelar',
        'Si, eliminar',
        () => {
          this.isModalOpen = false;
        },
        () => {
          this.deleteEnrolledCreditCard(loan);
        }
      );
    }
  }

  removeAccountFromArray(mArray: AccountBalance[], prop1: any) {
    const index = mArray.findIndex((e: AccountBalance) => {
      return prop1 === e.productNumber;
    });
    mArray.splice(index, 1);
    this.bdbToast.showToast('La obligación ha sido eliminada correctamente.');
  }

  private mapToItemCreditModelEnrolled(creditObligation: CardACObligation): BdbItemCardModel {
    return {
      title: creditObligation.cardTitle,
      desc: [
        ...creditObligation.cardDesc,
        ...creditObligation.cardSubDesc.map(this.bdbUtils.toCamelCase),
      ],
      product: creditObligation.credit,
      contraction: creditObligation.contraction,
      contextMenuList: [ {key: 'delete', value: 'Eliminar crédito', color: 'error', icon: 'bin-1', colorvariant: '700', showIcon: true}],
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
    actionModal2
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
      this.avalCreditObligationsFacade.removeACObligations();
        this.avalCreditObligationsFacade.fetchAvalCreditsObligations();
        loader.dismiss();
        const opts: PulseToastOptions = {
          text: 'El producto se ha eliminado correctamente',
          color: 'success',
          colorvariant: '100',
          image: 'assets/imgs/pulse-toast/toast-delete.svg',
          closeable: true,
        };
        await this.pulseToastService.create(opts);
      }, async () => {
        loader.dismiss();
        const opts: PulseToastOptions = {
          text: 'Error al eliminar el producto. Intenta más tarde.',
          color: 'error',
          colorvariant: '100',
          image: 'assets/imgs/pulse-toast/toast-warning.svg',
          closeable: true
        };
        await this.pulseToastService.create(opts);
      });
    });
  }

}

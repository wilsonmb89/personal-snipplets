import { Component } from '@angular/core';
import { Events, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { BillInfo } from '../../../../app/models/bills/bill-info';
import { BillPaymentInfo } from '../../../../app/models/bills/bill-payment-info';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../../../providers/bdb-mask/bdb-mask-type.enum';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { TrxResultBillService } from '@app/shared/modules/transaction-result/services/payments/transaction-result-bill.service';
import { PayBillRs } from 'new-app/core/services-apis/payment-billers/models/payment-billers-api.model';
import { PayBillDelegateService } from '@app/delegate/payment-billers-delegate/pay-bill-delegate.service';
import { BillersPaymentFacade } from '@app/modules/payments/store/facades/billers-payment.facade';

@IonicPage()
@Component({
  selector: 'page-bill-select-payment',
  templateUrl: 'bill-select-payment.html',
})
export class BillSelectPaymentPage {

  items: Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> = [];
  accounts: Array<ProductDetail> = [];
  subtitle: '¿Con qué quieres pagar?';
  enable = false;
  msgButton = 'Confirmar pago';
  backPage = true;
  billAmount: string;
  leftHdrOption = 'Atrás';
  hideLeftOption = false;
  navTitle = 'Pago de servicios';
  abandonText = BdbConstants.ABANDON_PAY;

  private _funnel = this.funnelKeys.getKeys().bills;

  constructor(
    public navCtrl: NavController,
    private bdbInMemory: BdbInMemoryProvider,
    private selectAccountHandler: SelectAccountHandlerProvider,
    private funnelKeys: FunnelKeysProvider,
    private progressBar: ProgressBarProvider,
    private bdbMask: BdbMaskProvider,
    private funnelEvents: FunnelEventsProvider,
    private navigation: NavigationProvider,
    private mobileSummary: MobileSummaryProvider,
    private loading: LoadingController,
    private navParams: NavParams,
    public events: Events,
    private txResultService: TrxResultBillService,
    private payBillDelegateService: PayBillDelegateService,
    private billersPaymentFacade: BillersPaymentFacade,
  ) {
    if (!!navParams.get('subscribe')) {
      this.leftHdrOption = '';
      this.hideLeftOption = true;
      events.publish('header:btn:remove', 'left');
    }
  }

  ionViewWillEnter() {
    this.progressBar.resetObject();
    this.accounts = this.selectAccountHandler.getAccountsAvailable(true);
    this.items = this.selectAccountHandler.getCardsMapping(this.accounts);
    const billPaymentInfo: BillPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.BillPaymentInfo);
    const mAccount: ProductDetail = this.selectAccountHandler.setFirstAccountSelection(this.accounts, this._funnel);
    if (mAccount !== null) {
      // add to model
      this.enable = true;
      billPaymentInfo.account = mAccount;
    }
    if (billPaymentInfo.bill.isInvGen) {
      billPaymentInfo.amount = billPaymentInfo.bill.amt;
    }
    this.billAmount = billPaymentInfo.amount;
    this.bdbInMemory.setItemByKey(InMemoryKeys.BillPaymentInfo, billPaymentInfo);
    this.updateBillProgressBar(billPaymentInfo.bill);
    this.updateMobileSummary(billPaymentInfo.amount);
    this.updateAmountProgressBar(billPaymentInfo.amount);
    this.events.publish('srink', true);
  }

  ionViewWillLeave() {
    this.events.publish('header:btn:add');
  }

  updateBillProgressBar(bill: BillInfo) {
    this.progressBar.setLogo('');
    this.progressBar.setContraction(bill.contraction);
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Servicio');
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [
      bill.nickname,
      bill.invoiceNum
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);
  }

  updateAmountProgressBar(amount) {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [
      this.bdbMask.maskFormatFactory(amount, MaskType.CURRENCY),
      `Costo: ${BdbConstants.TRANSACTION_COST.NO_COST}`
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
  }

  paymentSelected(item) {
    this.enable = true;
    this.items.forEach((e) => {
      e.isActive = false;
    });
    this.selectAccountHandler.paymentSelected(item, this._funnel, BdbConstants.PROGBAR_STEP_3);
    // add to model
    const billPaymentInfo: BillPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.BillPaymentInfo);
    billPaymentInfo.account = item.acct;
    this.bdbInMemory.setItemByKey(InMemoryKeys.BillPaymentInfo, billPaymentInfo);
  }

  send() {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.confirmation);
    const billPaymentInfo: BillPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.BillPaymentInfo);

    this.processBillPayment(billPaymentInfo);
  }

  private processBillPayment(billPaymentInfo: BillPaymentInfo): void {
    const loading = this.loading.create();
    loading.present();
    this.payBillDelegateService.payBill(billPaymentInfo)
      .subscribe({
        next: (payBillRs: PayBillRs) => {
          this.billersPaymentFacade.updateBillersPayment();
          this.buildResultData(billPaymentInfo, true, payBillRs.approvalId);
        },
        error: (ex) => {
          try {
            loading.dismiss();
            if (ex.status === 504 || ex.error.errorMessage.toLowerCase().match('timeout')) {
              this.billersPaymentFacade.updateBillersPayment();
              this.launchInfoPageTimeOut(billPaymentInfo);
            } else {
              this.buildResultData(billPaymentInfo, false, '', ex.error ? ex.error : null);
            }
          } catch (error) {
            this.buildResultData(billPaymentInfo, false);
          }
        },
        complete: () => {
          loading.dismiss();
        }
      });
  }

  private launchInfoPageTimeOut(billPaymentInfo: BillPaymentInfo): void {
    this.navCtrl.push('OperationInfoPage', {
      data: {
        amount: Number(billPaymentInfo.amount),
        amountText: 'Valor del servicio',
        bodyText: `Estamos presentando demoras.
                  <span class="pulse-tp-bo3-comp-b"> Si no ves reflejada la transacción
                  en los movimientos de tu cuenta en las próximas horas</span>,
                  intenta de nuevo.`,
        bodyTitle: 'Está tardando más de lo normal',
        buttonText: 'Entendido',
        dateTime: new Date().getTime(),
        image: 'assets/imgs/time-out-page/clock-warning.svg',
        title: 'Transacción en <span class="pulse-tp-hl3-comp-b">proceso</span>',
        buttonAction: () => {
          this.navCtrl.push('DashboardPage');
        }
      }
    });
  }

  updateMobileSummary(ammount) {
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  private buildResultData(
    billPaymentInfo: BillPaymentInfo,
    isSuccess: boolean,
    approvalId: string = '',
    errorData?: ApiGatewayError,
  ): void {
    const state: TransactionResultState = !isSuccess ? 'error' : 'success';
    this.txResultService.launchResultTransfer(this.navCtrl, state, billPaymentInfo, approvalId, errorData);
  }
}

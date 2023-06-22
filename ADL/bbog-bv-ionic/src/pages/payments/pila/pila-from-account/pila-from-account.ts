import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { MobileSummaryProvider, SummaryHeader, SummaryBody } from '../../../../components/mobile-summary';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { Customer } from '../../../../app/models/bdb-generics/customer';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { BdbRsaProvider } from '../../../../providers/bdb-rsa/bdb-rsa';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../../../providers/bdb-mask/bdb-mask-type.enum';
import { TrxResultPilaService } from '@app/shared/modules/transaction-result/services/payments/transaction-result-pila.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import {
  Account,
  GetBillRs,
  PaymentPilaRq,
  PaymentRs
} from '../../../../new-app/core/services-apis/payment-billers/models/payment-billers-api.model';
import {PaymentBillersApiService} from '../../../../new-app/core/services-apis/payment-billers/payment-billers-api.service';


@IonicPage({
  name: 'page%pila%from%account',
  segment: 'page-pila-from-account'
})
@Component({
  selector: 'page-pila-from-account',
  templateUrl: 'pila-from-account.html',
})
export class PilaFromAccountPage {

  private pilaInfo: { dataForm, billInfo: GetBillRs, charge };
  items: Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> = [];
  accounts: Array<ProductDetail>;
  accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct };
  private _funnel;
  customer: Customer;
  navTitle = 'Pago planilla asistida';
  abandonText = BdbConstants.ABANDON_PAY;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private navigation: NavigationProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private mobileSummary: MobileSummaryProvider,
    public selectAccountHandler: SelectAccountHandlerProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private progressBar: ProgressBarProvider,
    private bdbUtils: BdbUtilsProvider,
    private bdbRsa: BdbRsaProvider,
    private loading: LoadingController,
    private bdbMask: BdbMaskProvider,
    private txResultService: TrxResultPilaService,
    private paymentBillersApiService: PaymentBillersApiService
  ) {
    this._funnel = this.funnelKeysProvider.getKeys().pila;
    this.customer = this.bdbUtils.getCustomer();
    this.customer.identificationType = this.bdbRsa.encrypt(this.customer.identificationType);
    this.pilaInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.PilaInfo);
  }

  ionViewWillEnter() {
    this.accountsToShow();
    this.buildUpMobileSummary();
    this.buildProgressBar();
  }

  accountsToShow() {
    this.accounts = this.selectAccountHandler.getAccountsAvailable(true);
    this.items = this.selectAccountHandler.getCardsMapping(this.accounts);

    const acctOriginSelect = this.items.filter((e: { cardTitle, cardLabel, cardValue, isActive, acct: ProductDetail }) => {
      return e.acct.isActive;
    });

    this.accountSeleted = acctOriginSelect.length > 0 ? acctOriginSelect[0] : this.items[0];
    this.accountSeleted.isActive = true;
    this.selectAccountHandler.updateSelectedAccount(this.accountSeleted.acct, this._funnel);
  }

  ionViewDidLoad() {
  }

  buildProgressBar() {
    this.progressBar.setLogo('');
    this.progressBar.setContraction(BdbConstants.PAYMENT_PILA_CONTRACTION);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [
      this.pilaInfo.dataForm.type.name,
      this.pilaInfo.dataForm.ref
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [
      this.bdbMask.maskFormatFactory(this.pilaInfo.billInfo.bills[0].amount, MaskType.CURRENCY),
      `Costo: ${this.pilaInfo.charge}`
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);

  }


  buildUpMobileSummary() {


    const header: SummaryHeader = new SummaryHeader();

    header.title = this.pilaInfo.dataForm.type.name;
    header.hasContraction = true;
    header.contraction = BdbConstants.PAYMENT_PILA_CONTRACTION;
    header.details = [`No ${this.pilaInfo.dataForm.ref}`];
    this.mobileSummary.setHeader(header);
    const body: SummaryBody = new SummaryBody();
    body.textDown = 'Valor a pagar:';
    body.valueDown = this.bdbMask.maskFormatFactory(this.pilaInfo.billInfo.bills[0].amount, MaskType.CURRENCY);
    body.textUp = 'Costo de transacción';
    body.valueUp = this.pilaInfo.charge;
    this.mobileSummary.setBody(body);
  }

  paymentSelected(item) {
    this.items.forEach((e) => {
      e.isActive = false;
    });
    item.isActive = true;
    this.selectAccountHandler.updateSelectedAccount(item.acct, this._funnel);
    this.accountSeleted = item;
  }

  send() {
    this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.confirmation);
    this.processPay(this.buildRqPay());
  }

  buildRqPay(): PaymentPilaRq {
    const account: Account = {
      accountNumber: this.accountSeleted.acct.productDetailApi.productNumber,
      accountType: this.accountSeleted.acct.productDetailApi.productBankType,
    };
    return {
            amount: this.pilaInfo.billInfo.bills[0].amount,
            account: account,
            formNumber: this.pilaInfo.dataForm.ref,
            paymentCode:  this.bdbInMemory.getItemByKey(InMemoryKeys.orgId),
            period: this.pilaInfo.billInfo.bills[0].customPaymentInfo.INF,
            formHolderId: this.pilaInfo.billInfo.bills[0].customPaymentInfo.NIE,

    };
  }

  async processPay(payInfo: PaymentPilaRq) {

    const payPilaInfo = {
      payInfo,
      pilaInfo: this.pilaInfo,
      accountSeleted: this.accountSeleted
    };

    const loading = this.loading.create();
    await loading.present();

    this.paymentBillersApiService.pilaPayment(payInfo).subscribe(
      (rs: PaymentRs) => {
        loading.dismiss();
        this.buildResultData(payPilaInfo, true, rs.approvalId);
      }, (err) => {
        loading.dismiss();
        if (err.status === 504 || err.error.errorMessage.toLowerCase().match('timeout')) {
          this.launchInfoPageTimeOut(payInfo);
        } else {
          this.buildResultData(payPilaInfo, false, '', err.error ? err.error : null);
        }
      }
    );
  }

  private launchInfoPageTimeOut(payInfo: PaymentPilaRq): void {
    this.navCtrl.push('OperationInfoPage', {
      data: {
        amount: payInfo.amount,
        amountText: 'Valor del pago',
        bodyText: `
          Estamos presentando demoras. <span class="pulse-tp-bo3-comp-b">Si no ves
          reflejada la transacción en los movimientos de tu
          cuenta en las próximas horas</span>, intenta de nuevo.
        `,
        bodyTitle: 'Está tardando más de lo normal',
        buttonText: 'Entendido',
        dateTime: new Date().getTime(),
        image: 'assets/imgs/time-out-page/clock-warning.svg',
        title: 'Transacción en <span class="pulse-tp-hl3-comp-b">proceso</span>',
        buttonAction: () => {
          this.navCtrl.setRoot('DashboardPage');
        }
      }
    });
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  private buildResultData(
    payPilaInfo: {
      payInfo: PaymentPilaRq,
      pilaInfo: { dataForm, billInfo, charge },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    },
    isSuccess: boolean,
    approvalId: string = '',
    errorData?: ApiGatewayError
  ): void {
    const state: TransactionResultState = isSuccess ? 'success' : 'error';
    this.txResultService.launchResultTransfer(this.navCtrl, state, payPilaInfo, approvalId, errorData);
  }
}

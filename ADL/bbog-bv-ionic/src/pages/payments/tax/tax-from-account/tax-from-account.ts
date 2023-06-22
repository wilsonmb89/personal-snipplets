import { Component } from '@angular/core';
import { Customer } from 'app/models/bdb-generics/customer';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { AccountPay } from '../../../../app/models/pay/pila';
import { PayTaxRq, TaxInfoRq } from '../../../../app/models/pay/tax';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { MobileSummaryProvider, SummaryBody, SummaryHeader } from '../../../../components/mobile-summary';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../../../providers/bdb-mask/bdb-mask-type.enum';
import { BdbRsaProvider } from '../../../../providers/bdb-rsa/bdb-rsa';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { DistrictTaxDelegateService } from '../../../../new-app/core/services-delegate/payment-billers-delegate/district-tax-delegate';
import { ErrorMapperType } from '../../../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';
import { TrxResultTaxService } from '@app/shared/modules/transaction-result/services/payments/transaction-result-tax.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';

@IonicPage({
  name: 'page%tax%from%account',
  segment: 'page-tax-from-account'
})
@Component({
  selector: 'page-tax-from-account',
  templateUrl: 'tax-from-account.html',
})
export class TaxFromAccountPage {

  private taxInfoSel: { dataForm, taxInfo, charge };
  items: Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> = [];
  accounts: Array<ProductDetail>;
  accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct };
  private _funnel;
  customer: Customer;
  navTitle = 'Pago de impuesto';
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
    private districtTaxDelegateService: DistrictTaxDelegateService,
    private txResultService: TrxResultTaxService,
  ) {
    this._funnel = this.funnelKeysProvider.getKeys().tax;
    this.customer = this.bdbUtils.getCustomer();
    this.customer.identificationType = this.bdbRsa.encrypt(this.customer.identificationType);
    this.taxInfoSel = this.bdbInMemory.getItemByKey(InMemoryKeys.TaxInfo);
  }
  ionViewWillEnter() {
    this.accountsToShow();
    this.buildUpMobileSummary();
    this.buildProgressBar();

  }

  ionViewDidLoad() {
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

  buildProgressBar() {
    this.progressBar.setLogo('');
    this.progressBar.setContraction(this.taxInfoSel.taxInfo.bill.contraction);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [
      this.taxInfoSel.dataForm.tax.name,
      this.taxInfoSel.dataForm.ref
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);

    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [
      this.bdbMask.maskFormatFactory(this.taxInfoSel.taxInfo.bill.amount, MaskType.CURRENCY),
      `Costo: ${this.taxInfoSel.charge}`
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);

  }


  buildUpMobileSummary() {
    const header: SummaryHeader = new SummaryHeader();

    header.title = this.taxInfoSel.dataForm.tax.name;
    header.hasContraction = true;
    header.contraction = this.taxInfoSel.taxInfo.bill.contraction;
    header.details = [`No ${this.taxInfoSel.dataForm.ref}`];
    this.mobileSummary.setHeader(header);
    const body: SummaryBody = new SummaryBody();
    body.textDown = 'Valor a pagar:';
    body.valueDown = this.bdbMask.maskFormatFactory(this.taxInfoSel.taxInfo.bill.amount, MaskType.CURRENCY);
    body.textUp = 'Costo de transacción';
    body.valueUp = this.taxInfoSel.charge;
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

  buildRqPay(): PayTaxRq {
    const payTaxrq: PayTaxRq = new PayTaxRq();
    const taxInfoRq: TaxInfoRq = new TaxInfoRq();

    const accountPay: AccountPay = new AccountPay();
    accountPay.accountNumber = this.accountSeleted.acct.productNumberX;
    accountPay.accountType = this.accountSeleted.acct.productType;

    taxInfoRq.amount = this.taxInfoSel.taxInfo.bill.amount;
    taxInfoRq.taxFormNum = this.taxInfoSel.taxInfo.bill.invoiceNum;
    taxInfoRq.codeNIE = this.taxInfoSel.taxInfo.bill.codeNIE;

    taxInfoRq.codeService = this.taxInfoSel.taxInfo.bill.orgInfoName;
    taxInfoRq.account = (accountPay as any).toJSON(accountPay);

    payTaxrq.taxInfoRq = (taxInfoRq as any).toJSON(taxInfoRq);
    return payTaxrq;
  }

  processPay(payInfo: PayTaxRq) {
    const payTaxInfo: any = {
      payInfo,
      taxInfoSel: this.taxInfoSel,
      accountSeleted: this.accountSeleted
    };

    const loading = this.loading.create();
    loading.present();

    this.districtTaxDelegateService.payDistrictTax(
      this.accountSeleted.acct.productDetailApi,
      this.taxInfoSel.taxInfo.bill
    ).subscribe({
      next: (d) => {
        this.buildResultData(payTaxInfo, true, d.authCode);
      },
      error: (err) => {
        err.errorType === ErrorMapperType.Timeout ?
        this.launchInfoPageTimeOut(this.taxInfoSel.taxInfo.bill.amount) :
        this.buildResultData(payTaxInfo, false, '', err.error ? err.error : null);
        loading.dismiss();
      },
      complete: () => {
        loading.dismiss();
      }
    });

  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  private launchInfoPageTimeOut(amount) {
    this.navCtrl.push('OperationInfoPage', {
      data: {
        amount,
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

  private buildResultData(
    payTaxInfo: {
      payInfo: PayTaxRq,
      taxInfoSel: { dataForm, taxInfo, charge },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    },
    isSuccess: boolean,
    approvalId: string = '',
    errorData?: ApiGatewayError
  ): void {
    const state: TransactionResultState = isSuccess ? 'success' : 'error';
    this.txResultService.launchResultTransfer(this.navCtrl, state, payTaxInfo, approvalId, errorData);
  }
}

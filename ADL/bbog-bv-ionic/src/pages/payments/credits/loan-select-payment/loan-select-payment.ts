import { Component, ViewContainerRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { LoanPaymentInfo } from '../../../../app/models/credits/loan-payment-info';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { ObligationPaymentsService } from '../../../../new-app/modules/payments/services/obligation-payments.service';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';

@IonicPage()
@Component({
  selector: 'page-loan-select-payment',
  templateUrl: 'loan-select-payment.html',
})
export class LoanSelectPaymentPage {

  items: Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> = [];
  accounts: Array<ProductDetail> = [];
  subtitle: string;
  transactionCost: string;
  enable = false;
  abandonText = BdbConstants.ABANDON_PAY;
  msgButton = 'Confirmar pago';
  navTitle = 'Pago Crédito';
  private _funnel = this.funnelKeys.getKeys().credits;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private selectAccountHandler: SelectAccountHandlerProvider,
    private funnelKeys: FunnelKeysProvider,
    private progressBar: ProgressBarProvider,
    private mobileSummary: MobileSummaryProvider,
    private navigation: NavigationProvider,
    private obligationPaymentsService: ObligationPaymentsService,
    private viewRef: ViewContainerRef
  ) {
    this.subtitle = 'Selecciona la cuenta de origen';
  }

  ionViewWillEnter() {

    const loanPaymentInfo: LoanPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanPaymentInfo);
    this.accounts = this.selectAccountHandler.getAccountsAvailable(true);
    if (loanPaymentInfo.loan.owned) {
      if (loanPaymentInfo.loan.accountOwned.productType === BdbConstants.ATH_CREDITO_HIP) {
        this.accounts = this.selectAccountHandler.getAccountsAvailable(true, true);
      }
    }
    this.items = this.selectAccountHandler.getCardsMapping(this.accounts);
    this.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    const mAccount: ProductDetail = this.selectAccountHandler.setFirstAccountSelection(this.accounts, this._funnel);
    if (mAccount !== null) {
      // add to model
      this.enable = true;
      loanPaymentInfo.account = mAccount;
    }

    this.bdbInMemory.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);
    this.updateMobileSummary(loanPaymentInfo.amount);
    let paymentType = '';
    switch (loanPaymentInfo.paymentType) {
      case BdbConstants.PC_DECREASE_INSTALLMENTS: {
        paymentType = 'Reducir cuota: ';
        break;
      }
      case BdbConstants.PC_DECREASE_TERM: {
        paymentType = 'Reducir plazo: ';
        break;
      }
    }
    this.updateAmountProgressBar(paymentType, loanPaymentInfo.amount, this.transactionCost);
  }

  updateAmountProgressBar(paymentType: string, amount: string, transactionCost: string) {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [
      `${CurrencyFormatPipe.format(amount)}`,
      `Costo: ${transactionCost}`
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
    const loanPaymentInfo: LoanPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanPaymentInfo);
    loanPaymentInfo.account = item.acct;
    this.bdbInMemory.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);
  }

  send() {
    const loanPaymentInfo: LoanPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanPaymentInfo);
    this.obligationPaymentsService.payObligations(this._funnel, loanPaymentInfo, this.navCtrl, this.viewRef);
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
}

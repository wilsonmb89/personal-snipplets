import { Component, ViewContainerRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { CreditCardPaymentInfo } from '../../../../app/models/tc-payments/credit-card-payment-info';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { CreditCardOpsProvider } from '../../../../providers/credit-card-ops/credit-card-ops';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';

@IonicPage()
@Component({
  selector: 'page-credit-card-select-payment',
  templateUrl: 'credit-card-select-payment.html',
})
export class CreditCardSelectPaymentPage {

  items: Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> = [];
  accounts: Array<ProductDetail> = [];
  subtitle: string;
  enable = false;
  abandonText = BdbConstants.ABANDON_PAY;
  msgButton = 'Confirmar pago';
  navTitle = 'Pago Tarjetas de Crédito';

  private _funnel = this.funnelKeys.getKeys().cards;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private selectAccountHandler: SelectAccountHandlerProvider,
    private progressBar: ProgressBarProvider,
    private mobileSummary: MobileSummaryProvider,
    private navigation: NavigationProvider,
    private funnelKeys: FunnelKeysProvider,
    private viewRef: ViewContainerRef,
    private creditCardOps: CreditCardOpsProvider
  ) {
    this.subtitle = 'Selecciona la cuenta de origen';
  }

  ionViewWillEnter() {
    this.accounts = this.selectAccountHandler.getAccountsAvailable(true);
    this.items = this.selectAccountHandler.getCardsMapping(this.accounts);
    const ccPaymentInfo: CreditCardPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CreditCardInfo);
    const mAccount: ProductDetail = this.selectAccountHandler.setFirstAccountSelection(this.accounts, this._funnel);
    if (mAccount !== null) {
      // add to model
      this.enable = true;
      ccPaymentInfo.account = mAccount;
    }
    this.bdbInMemory.setItemByKey(InMemoryKeys.CreditCardInfo, ccPaymentInfo);
    this.updateMobileSummary(ccPaymentInfo.amount);
    this.updateAmountProgressBar(ccPaymentInfo.amount, ccPaymentInfo.transactionCost);
  }

  updateAmountProgressBar(amount: string, transactionCost: string) {
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
    const ccPaymentInfo: CreditCardPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CreditCardInfo);
    ccPaymentInfo.account = item.acct;
    this.bdbInMemory.setItemByKey(InMemoryKeys.CreditCardInfo, ccPaymentInfo);
  }


  send() {
    const ccPaymentInfo: CreditCardPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CreditCardInfo);
    this.creditCardOps.sendPayment(ccPaymentInfo, this._funnel, this.navCtrl, this.viewRef);
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

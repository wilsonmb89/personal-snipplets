import { Component, OnInit } from '@angular/core';
import { App, IonicPage, LoadingController, NavController } from 'ionic-angular';

import { DianTaxInfo } from '../../../../models/taxes-info';
import { ProductDetail } from '../../../../../../../app/models/products/product-model';
import { BdbConstants } from '../../../../../../../app/models/bdb-generics/bdb-constants';
import { SelectAccountHandlerProvider } from '../../../../../../../providers/select-account-handler/select-account-handler';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { ProgressBarProvider } from '../../../../../../../providers/progress-bar/progress-bar';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { RadioOptionCard } from '@app/shared/models/components/radio-selection-options.model';
import { MobileSummaryProvider } from '../../../../../../../components/mobile-summary';
import { PayDianDelegateService } from '@app/delegate/payment-billers-delegate/pay-dian-delegate.service';
import { TrxResultDianTaxService } from '@app/shared/modules/transaction-result/services/payments/transaction-result-dianTax.service';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';

@IonicPage({
  name: 'select%tax%payment%origin',
  segment: 'select-tax-payment-origin'
})
@Component({
  selector: 'select-tax-payment-origin',
  templateUrl: './select-tax-payment-origin.html'
})
export class SelectTaxPaymentOriginPage implements OnInit {

  validPaymentOrigin: boolean;
  accountItems: Array<RadioOptionCard> = [];
  creditCardItems: Array<RadioOptionCard> = [];
  selectedFromProd: ProductDetail;
  ccSubtitle: string;
  dianTaxInfo: DianTaxInfo;

  constructor(
    private navCtrl: NavController,
    private bdbStorageService: BdbStorageService,
    private selectAccountHandler: SelectAccountHandlerProvider,
    private progressBar: ProgressBarProvider,
    private mobileSummary: MobileSummaryProvider,
    public appCtrl: App,
    private payDianService: PayDianDelegateService,
    private loading: LoadingController,
    private txResultService: TrxResultDianTaxService
  ) {}

  ngOnInit(): void {
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_3, true);
  }

  ionViewWillEnter() {
    this.dianTaxInfo = this.bdbStorageService.getItemByKey(InMemoryKeys.TaxInfo);
    this.mobileSummary.getInstance();
    this.resetPage();
    this.checkAvaliableProducts();
  }

  public goPreviousPage(): void {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.goTaxSelectionPage();
    }
  }

  public goTaxSelectionPage(): void {
    this.navCtrl.setRoot(
      'PaymentsMainPage', { 'tab': 'tax' }
    );
  }

  public submit() {
    const loading = this.loading.create();
    loading.present();
    this.bdbStorageService.setItemByKey(InMemoryKeys.TaxInfo, this.dianTaxInfo);
    this.payDianService.taxPay(this.dianTaxInfo).subscribe({
      next: (res) => {
        this.bdbStorageService.clearItem(InMemoryKeys.CustomerProductList);
        this.buildResultData(this.dianTaxInfo, true, res.approvalId);
        loading.dismiss();
      },
      error: (ex) => {
        this.buildResultData(this.dianTaxInfo, false, '', ex.error ? ex.error : null);
        loading.dismiss();
      }
    });
  }

  public paymentSelected(item: RadioOptionCard, origin: string): void {
    if (origin === 'C') {
      this.accountItems.forEach(acc => acc.selected = false);
    } else {
      this.creditCardItems.forEach(acc => acc.selected = false);
    }
    this.setSelectedPayment(item.acct);
    this.updateProgressBar(item.cardTitle, item.cardLabel);
  }

  private resetPage(): void {
    this.accountItems.forEach(acc => acc.selected = false);
    this.creditCardItems.forEach(acc => acc.selected = false);
    this.validPaymentOrigin = false;
    this.selectedFromProd = null;
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, []);
  }

  private setSelectedPayment(acct: ProductDetail): void {
    this.validPaymentOrigin = true;
    this.dianTaxInfo.accountOrigin = acct;
  }

  private updateProgressBar(accTitle: string, accNumber: string): void {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, [
      accTitle,
      `No. ${accNumber}`
    ]);
  }

  private checkAvaliableProducts() {
    this.getAvaliableAccounts();
    this.getAvaliableCreditCards();
    const totalProds = [...this.accountItems, ...this.creditCardItems];
    if (totalProds.length === 0) {
      this.goTaxSelectionPage();
    } else if (totalProds.length === 1) {
      this.validPaymentOrigin = true;
      this.setSelectedPayment(totalProds[0].acct);
      this.updateProgressBar(totalProds[0].cardTitle, totalProds[0].cardLabel);
    }
  }

  private getAvaliableAccounts(): void {
    this.accountItems = [];
    try {
      const accounts = this.selectAccountHandler.getAccountsAvailable(true);
      if (!!accounts && accounts.length > 0) {
        this.accountItems = this.selectAccountHandler
          .getCardsMapping(accounts).map(this.mapRadioOptionCard);
      }
    } catch (error) {}
    this.ccSubtitle =
      this.accountItems.length > 0 ?
      'También puedes usar tu Tarjeta de Crédito' :
      'Paga con tu Tarjeta de Crédito';
  }

  private getAvaliableCreditCards(): void {
    this.creditCardItems = [];
    try {
      const accounts: Array<ProductDetail> =
        this.bdbStorageService.getItemByKey(InMemoryKeys.CustomerProductList)
          .filter((acct: ProductDetail) => acct.category === BdbConstants.TARJETA_CREDITO_BBOG);
      if (!!accounts && accounts.length > 0) {
        this.creditCardItems = this.selectAccountHandler
          .getCardsMapping(accounts).map(this.mapRadioOptionCard);
      }
    } catch (error) {}
  }

  private mapRadioOptionCard(item: { cardTitle, cardLabel, cardValue, isActive, acct }): RadioOptionCard {
    const option = new RadioOptionCard();
    option.cardTitle = item.cardTitle;
    option.cardLabel = item.cardLabel;
    option.cardValue = item.cardValue;
    option.selected = item.isActive;
    option.acct = item.acct;
    return option;
  }

  private buildResultData(dianTaxInfo: DianTaxInfo, isSuccess: boolean, approvalId: string = '', errorData?: ApiGatewayError): void {
    const state: TransactionResultState = isSuccess ? 'success' : 'error';
    this.txResultService.launchResultTransfer(this.navCtrl, state, dianTaxInfo, approvalId, errorData);
  }

}

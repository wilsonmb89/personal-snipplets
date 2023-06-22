import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BalanceStatus, BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { LoanTransferInfo } from '../../../../app/models/loan-transfer/loan-transfer-info';
import { mapDetailsBalance, ProductDetail } from '../../../../app/models/products/product-model';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { AvalOpsProvider } from '../../../../providers/aval-ops/aval-ops';
import { GetBalancesByAccountRs } from '../../../../providers/aval-ops/aval-ops-models';
import { BalanceUtilsProvider } from '../../../../providers/balance-utils/balance-utils';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { BdbToastProvider } from '../../../../providers/bdb-toast/bdb-toast';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';

@PageTrack({ title: 'page-loan-transfer-origin' })
@Component({
  selector: 'page-loan-transfer-origin',
  templateUrl: 'loan-transfer-origin.html',
})
export class LoanTransferOriginPage implements OnInit {

  title: string;
  subtitle: string;
  logoPath: string;
  showBalanceLoader = false;
  loans: Array<{ cardTitle, cardDesc, cardSubDesc, loan }> = [];
  abandonText = BdbConstants.ABANDON_TRANS;

  private _funnel = this.funnelKeys.getKeys().loanTransfer;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbMask: BdbMaskProvider,
    private progressBar: ProgressBarProvider,
    private funnelEvents: FunnelEventsProvider,
    private funnelKeys: FunnelKeysProvider,
    private mobileSummary: MobileSummaryProvider,
    private bdbUtils: BdbUtilsProvider,
    private balanceUtils: BalanceUtilsProvider,
    private bdbToast: BdbToastProvider,
    private avalOps: AvalOpsProvider
  ) {
    this.title = 'Uso de Crédito';
    this.subtitle = 'Selecciona el producto para transferencia';
    this.logoPath = BdbConstants.BBOG_LOGO_WHITE;
  }

  ngOnInit() {
    this.setUpProgressBar();
    const customerProducts: Array<ProductDetail> = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (customerProducts) {
      this.setUpLoanTransfer(customerProducts);
    }
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);
  }

  setUpLoanTransfer(customerProducts: ProductDetail[]) {
    this.loans = [];
    const filteredLoans = customerProducts.filter(e => {
      return e.productType === BdbConstants.ATH_CREDISERVICE_ALS_PNATURAL
        || e.productType === BdbConstants.ATH_ADELANTO_NOMINA
        || e.productType === BdbConstants.ATH_CREDISERVICE_AP;
    });
    let counterSuccess = 0;
    let counterError = 0;
    const arrayLength = filteredLoans.length;

    filteredLoans.forEach((e) => {
      if (e.balanceDetail && e.balanceDetail !== {}) {
        counterSuccess++;
        this.monitorBalances(counterSuccess, counterError, arrayLength);
        this.mapLoanTransferCards(e);
      } else {
        this.showBalanceLoader = true;
        this.avalOps.getBalancesByAccount(e).subscribe(
          (data: GetBalancesByAccountRs) => {
            counterSuccess++;
            this.monitorBalances(counterSuccess, counterError, arrayLength);
            e.balanceDetail = mapDetailsBalance(data.details);
            this.mapLoanTransferCards(e);
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

  monitorBalances(counterSuccess: number, counterError: number, arrayLength: number) {
    this.resolveBalances(this.balanceUtils.checkBalanceInquiryStatus(counterSuccess, counterError, arrayLength));
  }

  resolveBalances(balanceStatus: BalanceStatus) {
    if (balanceStatus === BalanceStatus.FINISHED) {
      this.showBalanceLoader = false;
    } else if (balanceStatus === BalanceStatus.FINISHED_WITH_ERROR) {
      this.showBalanceLoader = false;
      this.bdbToast.showToastGeneric({
        message: 'Algunos de tus créditos no pudieron ser consultados',
        close: true,
        color: 'toast-error',
        type: 'delete'
      });
    }
  }

  mapLoanTransferCards(loan: ProductDetail) {
    const propertyToShow = this.bdbUtils.mapLoanTransferProperty(loan.productType);
    const tempCard = {
      cardTitle: loan.productName,
      cardDesc: [
        `No. ${loan.productNumber}`
      ],
      cardSubDesc: [
        `${BdbConstants.namedMap[propertyToShow].label}:
          ${this.bdbMask.maskFormatFactory(loan.balanceDetail[propertyToShow], BdbConstants.namedMap[propertyToShow].format)}`
      ],
      loan
    };
    this.loans.push(tempCard);
  }

  setUpProgressBar() {
    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Destino');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor a transferir');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Origen');
  }

  processSelection(item) {
    const loan: ProductDetail = item;
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.pickLoan);
    const loanTransfer: LoanTransferInfo = new LoanTransferInfo();
    loanTransfer.loan = loan;
    this.bdbInMemory.setItemByKey(InMemoryKeys.LoanTransferInfo, loanTransfer);
    this.navCtrl.push('LoanTransferAmountPage');
  }
}

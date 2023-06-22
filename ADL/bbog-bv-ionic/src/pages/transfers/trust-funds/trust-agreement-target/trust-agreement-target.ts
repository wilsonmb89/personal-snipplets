import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BalanceStatus, BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { mapDetailsBalance, ProductDetail } from '../../../../app/models/products/product-model';
import { TrustAgreementInfo } from '../../../../app/models/trust-agreement/trust-agreement-info';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { AvalOpsProvider } from '../../../../providers/aval-ops/aval-ops';
import { GetBalancesByAccountRs } from '../../../../providers/aval-ops/aval-ops-models';
import { BalanceUtilsProvider } from '../../../../providers/balance-utils/balance-utils';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../../../providers/bdb-mask/bdb-mask-type.enum';
import { BdbToastProvider } from '../../../../providers/bdb-toast/bdb-toast';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { BdbModalProvider, ModalGenericInfo } from '../../../../providers/bdb-modal/bdb-modal';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';

@PageTrack({ title: 'page-trust-agreement-target' })
@Component({
  selector: 'page-trust-agreement-target',
  templateUrl: 'trust-agreement-target.html',
})
export class TrustAgreementTargetPage implements OnInit {

  title = 'Transferir Encargos Fiduciarios';
  subtitle = 'Selecciona la Fiducia';
  abandonText = BdbConstants.ABANDON_TRANS;
  showBalanceLoader = false;

  agreements: Array<{ logoPath, cardTitle, cardDesc, cardSubDesc, agreement }> = [];

  private _funnel = this.funnelKeysProvider.getKeys().fiducias;

  constructor(
    private bdbInMemory: BdbInMemoryProvider,
    public navCtrl: NavController,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private progressBar: ProgressBarProvider,
    private bdbMask: BdbMaskProvider,
    private mobileSummary: MobileSummaryProvider,
    private avalOps: AvalOpsProvider,
    private bdbToast: BdbToastProvider,
    private balanceUtils: BalanceUtilsProvider,
    private bdbModal: BdbModalProvider,
    private bdbUtils: BdbUtilsProvider
  ) {
  }

  ngOnInit() {
    this.setUpProgressBar();
    const customerProducts: Array<ProductDetail> = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (customerProducts) {
      this.setTrustAgreementsCards(customerProducts);
    }
  }

  setTrustAgreementsCards(customerProducts: ProductDetail[]) {
    this.agreements = [];
    const trustAgreements = customerProducts.filter(e => {
      return e.category === BdbConstants.FIDUCIAS_BBOG;
    });

    let counterSuccess = 0;
    let counterError = 0;
    const arrayLength = trustAgreements.length;

    trustAgreements.forEach((f: ProductDetail) => {
      if (f.balanceDetail && f.balanceDetail !== {}) {
        counterSuccess++;
        this.monitorBalances(counterSuccess, counterError, arrayLength);
        this.mapFundsTransferCard(f);
      } else {
        this.showBalanceLoader = true;
        this.avalOps.getBalancesByAccount(f).subscribe(
          (data: GetBalancesByAccountRs) => {
            counterSuccess++;
            this.monitorBalances(counterSuccess, counterError, arrayLength);
            const bDetail = mapDetailsBalance(data.details);
            f.balanceDetail = bDetail;
            f.amount = f.balanceDetail.totalBBOG;
            f.description = BdbConstants.namedMap.totalBBOG.label;
            this.mapFundsTransferCard(f);
            this.bdbInMemory.setItemByKey(InMemoryKeys.CustomerProductList, customerProducts);
          },
          (err) => {
            counterError++;
            this.monitorBalances(counterSuccess, counterError, arrayLength);
          }
        );
      }
    });
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);
  }

  monitorBalances(counterSuccess: number, counterError: number, arrayLength: number) {
    this.resolveBalances(this.balanceUtils.checkBalanceInquiryStatus(counterSuccess, counterError, arrayLength));
  }

  resolveBalances(balanceStatus: BalanceStatus) {
    if (balanceStatus === BalanceStatus.FINISHED) {
      this.showBalanceLoader = false;
    } else if (balanceStatus === BalanceStatus.FINISHED_WITH_ERROR) {
      this.showBalanceLoader = false;
      this.bdbToast.showToast('Algunas de tus fiducias no pudieron ser consultadas');
    }
  }

  mapFundsTransferCard(fidu: ProductDetail) {
    let info: string;
    if (fidu.balanceDetail['disponibleBBOG']) {
      info = `Disponible: ${this.bdbMask.maskFormatFactory(fidu.balanceDetail['disponibleBBOG'], MaskType.CURRENCY)}`;
    }
    const tempCard = {
      logoPath: BdbConstants.BBOG_LOGO_WHITE,
      cardTitle: fidu.productName,
      cardDesc: [
        `No. ${fidu.productNumber}`
      ],
      cardSubDesc: [
        info
      ],
      agreement: fidu
    };
    this.agreements.push(tempCard);
  }

  setUpProgressBar() {
    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Destino');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor a transferir');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Origen');
  }

  processSelection(item) {

    this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.pickFidu);

    if (this.bdbUtils.validateBusinessDay()) {
      const agreement: ProductDetail = item;
      const trust: TrustAgreementInfo = new TrustAgreementInfo();
      trust.agreement = agreement;
      this.bdbInMemory.setItemByKey(InMemoryKeys.TrustAgreementInfo, trust);

      this.navCtrl.push('TrustAgreementAmountPage');
    } else {
      this.bdbModal.launchModalContingencyFIC();
    }
  }

  onAbandon() {
    this.navCtrl.popToRoot();
  }
}

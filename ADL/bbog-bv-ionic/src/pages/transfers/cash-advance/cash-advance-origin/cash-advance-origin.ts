import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BalanceStatus, BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { mapDetailsBalance, ProductDetail } from '../../../../app/models/products/product-model';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { CashAdvanceInfo } from '../../../../app/models/cash-advance/cash-advance-info';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { AvalOpsProvider } from '../../../../providers/aval-ops/aval-ops';
import { GetBalancesByAccountRs } from '../../../../providers/aval-ops/aval-ops-models';
import { TsErrorProvider } from '../../../../providers/ts-error/ts-error-provider';
import { BalanceUtilsProvider } from '../../../../providers/balance-utils/balance-utils';
import { BdbToastProvider } from '../../../../providers/bdb-toast/bdb-toast';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';
import { UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import { take } from 'rxjs/operators';

@PageTrack({ title: 'page-cash-advance-origin' })
@Component({
  selector: 'page-cash-advance-origin',
  templateUrl: 'cash-advance-origin.html',
})
export class CashAdvanceOriginPage implements OnInit {

  title: string;
  subtitle: string;
  itemCards: Array<{ cardTitle, cardDesc, cardSubDesc, creditCard }> = [];
  logoPath: string;
  showBalanceLoader = false;

  private _funnel = this.funnelKeys.getKeys().cashAdvance;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbMask: BdbMaskProvider,
    private progressBar: ProgressBarProvider,
    private funnelEvents: FunnelEventsProvider,
    private funnelKeys: FunnelKeysProvider,
    private mobileSummary: MobileSummaryProvider,
    private navigation: NavigationProvider,
    private avalOps: AvalOpsProvider,
    private tsError: TsErrorProvider,
    private balanceUtils: BalanceUtilsProvider,
    private bdbToast: BdbToastProvider,
    private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService,
    private userFeaturesService: UserFeaturesDelegateService
  ) {
    this.title = 'Avances';
    this.subtitle = 'Selecciona la tarjeta para el avance';
    this.logoPath = BdbConstants.BBOG_LOGO_WHITE;
  }

  ngOnInit() {
    this.setUpProgressBar();
    this.itemCards = [];
    const customerProducts: Array<ProductDetail> = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (customerProducts) {
      this.setCreditCards(customerProducts);
    }
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);
    // ToDo: This is the solution for the navigation between specific product transaction and MF navigation (Example: Succesfully cash advance to Transfers legacy module) 
    this.userFeaturesService
      .isAllowedServiceFor('cashAdvance')
      .pipe(take(1))
      .subscribe((isActive) => {
        if (isActive)
          this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow(
            '/transferencias/avances'
          );
      });
  }

  mapBdbItemCard(ccd: ProductDetail) {
    const tempCard = {
      cardTitle: ccd.productName,
      cardDesc: [
        `${ccd.franchise} ${ccd.productNumber}`
      ],
      cardSubDesc: [
        `Cupo avance: ${this.bdbMask.maskFormatFactory(ccd.balanceDetail.cupoAvancesBBOG,
          BdbConstants.namedMap['cupoAvancesBBOG'].format)}`
      ],
      creditCard: ccd
    };
    this.itemCards.push(tempCard);
  }

  setCreditCards(customerProducts: ProductDetail[]) {
    this.itemCards = [];
    const credCards = customerProducts.filter(e => {
      return e.category === BdbConstants.TARJETA_CREDITO_BBOG;
    });

    let counterSuccess = 0;
    let counterError = 0;
    const arrayLength = credCards.length;

    credCards.forEach((f: ProductDetail) => {
      if (f.balanceDetail && f.balanceDetail !== {}) {
        counterSuccess++;
        this.monitorBalances(counterSuccess, counterError, arrayLength);
        this.mapBdbItemCard(f);
      } else {
        this.showBalanceLoader = true;
        this.avalOps.getBalancesByAccount(f).subscribe(
          (data: GetBalancesByAccountRs) => {
            counterSuccess++;
            this.monitorBalances(counterSuccess, counterError, arrayLength);
            const bDetail = mapDetailsBalance(data.details);
            bDetail.franchise = f.franchise;
            f.balanceDetail = bDetail;
            f.amount = f.balanceDetail.cupoComprasBBOG;
            f.description = BdbConstants.namedMap.cupoComprasBBOG.label;
            this.mapBdbItemCard(f);
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
      this.bdbToast.showToast('Algunas de tus tarjetas no pudieron ser consultadas');
    }
  }

  setUpProgressBar() {
    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Tarjeta de Crédito');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor del avance');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Cuenta destino');
  }

  processSelection(item) {
    const creditCard: ProductDetail = item;
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.pickCard);
    const cashInfo: CashAdvanceInfo = new CashAdvanceInfo();
    cashInfo.creditCard = creditCard;
    this.bdbInMemory.setItemByKey(InMemoryKeys.CashAdvanceInfo, cashInfo);
    this.navCtrl.push('CashAdvanceAmountPage');
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }
}

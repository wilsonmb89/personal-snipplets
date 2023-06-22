import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController } from 'ionic-angular';
import { ProductDetail } from '../../../app/models/products/product-model';
import { BdbConstants } from '../../../app/models/bdb-generics/bdb-constants';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { LimitsProvider } from '../../../providers/limits/limits';
import { ProgressBarProvider } from '../../../providers/progress-bar/progress-bar';
import { MobileSummaryProvider } from '../../../components/mobile-summary';
import { AccountLimitsRq } from '../../../app/models/limits/get-accounts-limits-request';
import { GetAccountsLimitsRs, LimitsRs } from '../../../app/models/limits/get-accounts-limits-response';
import { BdbModalProvider } from '../../../providers/bdb-modal/bdb-modal';
import { NavigationProvider } from '../../../providers/navigation/navigation';
import { FilterUtilsProvider } from '../../../providers/filter-utils/filter-utils';
import { BdbUtilsProvider } from '../../../providers/bdb-utils/bdb-utils';
import { GetLimitsNalAccDelegateService } from '@app/delegate/customer-security-delegate/get-limits-nal-acc-delegate.service';
import {
  ServiceApiErrorModalService
} from '@app/shared/components/modals/service-api-error-modal/provider/service-api-error-modal.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';

@IonicPage({
  segment: 'nat%acct%limits%select%acct',
  name: 'nat%acct%limits%select%acct'
})
@Component({
  selector: 'page-nat-acct-limits-select-acct',
  templateUrl: 'nat-acct-limits-select-acct.html',
})
export class NatAcctLimitsSelectAcctPage {

  title: string;
  subtitle: string;
  accounts: Array<ProductDetail>;
  logoPath: string;
  abandonText: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private events: Events,
    private limitsProvider: LimitsProvider,
    private progressBar: ProgressBarProvider,
    private mobileSummary: MobileSummaryProvider,
    private navigation: NavigationProvider,
    private filterUtils: FilterUtilsProvider,
    private bdbUtils: BdbUtilsProvider,
    private getLimitsNalAccService: GetLimitsNalAccDelegateService,
    private loadingCtrl: LoadingController,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private serviceApiErrorModalService: ServiceApiErrorModalService,
  ) {
    this.title = 'Modificar Límite de cuenta nacional';
    this.subtitle = 'Selecciona el producto a modificar';
    this.logoPath = BdbConstants.BBOG_LOGO_WHITE;
    this.abandonText = 'Abandonar Límite de cuenta nacional';

    const customerProducts: Array<ProductDetail> = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (customerProducts) {
      this.accounts = customerProducts.filter(this.filterUtils.getValidAccountsToPay());
    }
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {

    this.events.publish('header:title', this.title);
    this.progressBar.resetObjectTwoSteps();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Producto');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Límite de cuenta nacional');
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);

    this.bdbInMemory.setItemByKey(InMemoryKeys.PaymentOrigin, 'natAcctLimits');
  }

  processSelection(account: ProductDetail) {

    this.limitsProvider.updateProgressBarDetail(account);
    this.limitsProvider.setUpMobileSummary(account);
    const loading = this.loadingCtrl.create();

    loading.present().then(() => {
      this.getLimitsNalAccService.limitInformationNatAcc(account)
      .map(
        data => {
          const res = new GetAccountsLimitsRs();
          res.error = null;
          res.limits = data.bankLimit.map(limit => {
            const transLimit = new LimitsRs();
            transLimit.desc = 'Límite de cuenta nacional';
            transLimit.amount = limit.amount;
            return transLimit;
          });
          return res;
        }
      )
      .subscribe(
        data => {
          const accountLimitsRq = new AccountLimitsRq();
          accountLimitsRq.accountNumber = account.productNumberApi;
          accountLimitsRq.accountType = this.bdbUtils.mapTypeProduct(account.productType);
          const limits = data.limits;
          this.bdbInMemory.setItemByKey(InMemoryKeys.AccountLimits, limits);
          this.bdbInMemory.setItemByKey(InMemoryKeys.AccountLimitsRq, accountLimitsRq);
          this.navCtrl.push('nat%acct%limits');
          loading.dismiss();
        },
        (ex) => {
          loading.dismiss();
          const errorData: ApiGatewayError = ex.error ? ex.error : null;
          this.serviceApiErrorModalService.launchErrorModal(
            this.viewRef,
            this.resolver,
            !!errorData ? errorData.customerErrorMessage : null
          );
        }
      );
    });
  }

  onAbandon() {
    this.navigation.onAbandonPressed(this.navCtrl);
  }
}

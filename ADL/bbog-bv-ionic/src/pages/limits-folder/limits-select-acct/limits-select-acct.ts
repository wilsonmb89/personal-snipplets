import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Events, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { BdbConstants } from '../../../app/models/bdb-generics/bdb-constants';
import { AccountLimitsRq } from '../../../app/models/limits/get-accounts-limits-request';
import { GetAccountsLimitsRs, LimitsRs } from '../../../app/models/limits/get-accounts-limits-response';
import { ProductDetail } from '../../../app/models/products/product-model';
import { MobileSummaryProvider } from '../../../components/mobile-summary';
import { BdbUtilsProvider } from '../../../providers/bdb-utils/bdb-utils';
import { FilterUtilsProvider } from '../../../providers/filter-utils/filter-utils';
import { LimitsProvider } from '../../../providers/limits/limits';
import { NavigationProvider } from '../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { GetLimitsDelegateService } from '@app/delegate/customer-security-delegate/get-limits-delegate.service';
import {
  ServiceApiErrorModalService
} from '@app/shared/components/modals/service-api-error-modal/provider/service-api-error-modal.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { UpdateLimitState } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.types';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';

@IonicPage({
  name: 'limits%select%acct',
  segment: 'limits%select%acct'
})
@Component({
  selector: 'page-limits-select-acct',
  templateUrl: 'limits-select-acct.html',
})
export class LimitsSelectAcctPage {

  title: string;
  subtitle: string;
  accounts: Array<ProductDetail> = [];
  logoPath: string;
  abandonText: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private limitsProvider: LimitsProvider,
    private progressBar: ProgressBarProvider,
    private mobileSummary: MobileSummaryProvider,
    private events: Events,
    private navigation: NavigationProvider,
    private filterUtils: FilterUtilsProvider,
    private bdbUtils: BdbUtilsProvider,
    private loading: LoadingController,
    private getLimitsService: GetLimitsDelegateService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private serviceApiErrorModalService: ServiceApiErrorModalService,
    private microfrontendService: BdbMicrofrontendEventsService
  ) {
    this.title = 'Modificar topes';
    this.subtitle = 'Selecciona el producto a modificar';
    this.logoPath = BdbConstants.BBOG_LOGO_WHITE;
    this.abandonText = 'Abandonar topes';

    const customerProducts: Array<ProductDetail> = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (customerProducts) {
      this.accounts = customerProducts.filter(this.filterUtils.getValidAccountsToPay());
    }
  }

  ionViewWillEnter() {
    this.events.publish('header:title', this.title);
    this.events.publish('menu:active', 'settings%app');
    this.events.publish('srink', false);
    this.progressBar.resetObjectTwoSteps();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Producto');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Topes');
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);
    this.bdbInMemory.setItemByKey(InMemoryKeys.PaymentOrigin, 'limits');
  }

  processSelection(account: ProductDetail) {

    this.limitsProvider.updateProgressBarDetail(account);
    this.limitsProvider.setUpMobileSummary(account);

    const loading = this.loading.create();
    loading.present().then(() => {
      this.getLimitsService.limitInformation(account)
      .map(
        data => {
          const res = new GetAccountsLimitsRs();
          res.error = null;
          res.limits = data.bankLimit.map(limit => {
            const transLimit = new LimitsRs();
            transLimit.desc = limit.desc;
            transLimit.networkOwner = limit.channel;
            transLimit.trnCount = limit.count;
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
          const updateInformation = {
            acctId: accountLimitsRq.accountNumber,
            acctType: accountLimitsRq.accountType
          };
          this.microfrontendService.saveStateInSessionStorage<UpdateLimitState>('UpdateLimitState', updateInformation);
          this.microfrontendService.sendRouteEventToParentWindow('/settings/limits-form?origin=warning');
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

import { Injectable } from '@angular/core';
import { AccountLimitsRq, GetAccountsLimitsRq } from '../../app/models/limits/get-accounts-limits-request';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { LoadingController, Loading, NavController, Events, App } from 'ionic-angular';
import { TransactionsProvider } from '../transactions/transactions';
import { LimitsRq, AccountsLimitsUpdateRq } from '../../app/models/limits/accounts-limits-update-request';
import { GetAccountsLimitsRs, LimitsRs } from '../../app/models/limits/get-accounts-limits-response';
import { ProductDetail } from '../../app/models/products/product-model';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { SummaryHeader, MobileSummaryProvider, SummaryBody } from '../../components/mobile-summary';
import { ProgressBarProvider } from '../progress-bar/progress-bar';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { BdbPlatformsProvider } from '../bdb-platforms/bdb-platforms';

@Injectable()
export class LimitsProvider {

  constructor(
    readonly bdbUtilsProvider: BdbUtilsProvider,
    readonly loadingCtrl: LoadingController,
    readonly transactionsProvider: TransactionsProvider,
    readonly progressBar: ProgressBarProvider,
    readonly mobileSummary: MobileSummaryProvider,
    readonly bdbMask: BdbMaskProvider,
    public events: Events,
    readonly appCtrl: App,
    readonly bdbPlatforms: BdbPlatformsProvider
  ) {
  }

  getAccountsLimits(
    account: AccountLimitsRq,
    next?: (value: any) => void,
    error?: (error: any) => void
  ) {

    const getAccountsLimitsRq = new GetAccountsLimitsRq();
    getAccountsLimitsRq.account = account;
    getAccountsLimitsRq.customer = this.bdbUtilsProvider.getCustomer();

    const loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present().then(() => {
      this.transactionsProvider.getAccountsLimits(getAccountsLimitsRq)
        .subscribe(
          data => {
            this.dismiss(data, loading);
            next(data);
          },
          err => {
            this.error(err, loading);
            error(err);
          }
        );
    });
  }

  getNatAccountsLimits(
    account: AccountLimitsRq,
    next?: (value: any) => void,
    error?: (error: any) => void
  ) {

    const getAccountsLimitsRq = new GetAccountsLimitsRq();
    getAccountsLimitsRq.account = account;
    getAccountsLimitsRq.customer = this.bdbUtilsProvider.getCustomer();

    const loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present().then(() => {
      this.transactionsProvider.getNatAccountsLimits(getAccountsLimitsRq)
        .subscribe(
          data => {

            this.dismiss(data, loading);
            next(data);
          },
          err => {
            this.error(err, loading);
            error(err);
          }
        );
    });
  }

  accountsLimitsUpdate(
    limits: Array<LimitsRq>,
    account: AccountLimitsRq,
    next?: (value: any) => void,
    error?: (error: any) => void
  ) {

    const accountsLimitsUpdateRq = new AccountsLimitsUpdateRq();
    accountsLimitsUpdateRq.limits = limits;
    accountsLimitsUpdateRq.account = account;
    accountsLimitsUpdateRq.customer = this.bdbUtilsProvider.getCustomer();

    const loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present().then(() => {
      this.transactionsProvider.accountsLimitsUpdate(accountsLimitsUpdateRq)
        .subscribe(
          data => {
            this.dismiss(data, loading);
            next(data);
          },
          err => {
            this.dismiss(err, loading);
            error(err);
          }
        );
    });

  }

  natAccountsLimitsUpdate(
    limits: Array<LimitsRq>,
    account: AccountLimitsRq,
    next?: (value: any) => void,
    error?: (error: any) => void
  ) {

    const accountsLimitsUpdateRq = new AccountsLimitsUpdateRq();
    accountsLimitsUpdateRq.limits = limits;
    accountsLimitsUpdateRq.account = account;
    accountsLimitsUpdateRq.customer = this.bdbUtilsProvider.getCustomer();
    accountsLimitsUpdateRq.amount = limits[0].amount;

    const loading = this.loadingCtrl.create({
      content: ''
    });

    loading.present().then(() => {
      this.transactionsProvider.natAccountsLimitsUpdate(accountsLimitsUpdateRq)
        .subscribe(
          data => {
            this.dismiss(data, loading);
            next(data);
          },
          err => {
            this.dismiss(err, loading);
            error(err);
          }
        );
    });

  }

  dismiss(data, loading) {
    loading.dismiss();
  }

  error(err, loading) {
    loading.dismiss();
  }

  updateProgressBarDetail(product: ProductDetail) {

    this.progressBar.setLogo(BdbConstants.BBOG_LOGO_WHITE);
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, product.productName);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [
      product.productNumber,
      'Banco de Bogotá'
    ]);

    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);
  }

  setUpMobileSummary(product: ProductDetail) {
    const header: SummaryHeader = new SummaryHeader();
    header.title = product.productName;
    header.logoPath = BdbConstants.BBOG_LOGO_WHITE;
    header.hasContraction = false;
    header.details = [product.productNumber];
    this.mobileSummary.setHeader(header);
    this.mobileSummary.setBody(null);
  }

  updateProgressBarStep2(title: string, details: Array<string>) {
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, title);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, details);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
  }

  updateMobileSummary(title: string, count: string): SummaryBody {
    const body: SummaryBody = new SummaryBody();
    body.textUp = title;
    body.valueUp = count;
    body.textDown = '';
    body.valueDown = '';
    this.mobileSummary.setBody(body);

    return body;
  }

  mapLimitsUpdate(limits: LimitsRs[]): Array<LimitsRq> {

    return limits.filter(e => {
      return e.edit;
    }).map(e => {

      const limitsRq = new LimitsRq();
      limitsRq.amount = this.bdbMask.unmaskToPlainNumber(e.amount).toString();
      limitsRq.networkOwner = e.networkOwner;
      limitsRq.trnCount = e.trnCount;
      limitsRq.desc = e.desc;

      return limitsRq;
    });
  }

}

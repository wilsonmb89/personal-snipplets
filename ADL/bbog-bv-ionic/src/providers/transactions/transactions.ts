import { Injectable } from '@angular/core';
import { TransactionRq } from '../../app/models/transactions/transactions-request';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { Observable } from 'rxjs/Observable';
import { GetAccountsLimitsRs } from '../../app/models/limits/get-accounts-limits-response';
import { GetAccountsLimitsRq } from '../../app/models/limits/get-accounts-limits-request';
import { AccountsLimitsUpdateRq } from '../../app/models/limits/accounts-limits-update-request';
import { Loading } from 'ionic-angular';
import { TsErrorProvider } from '../ts-error/ts-error-provider';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { ProductDetail } from '../../app/models/products/product-model';
import { Account } from '../../app/models/fiducia/account';
import { Customer } from '../../app/models/bdb-generics/customer';
import { ENV } from '@app/env';
import { TransactionRequestFiduciary } from '../../app/models/fiducia/transaction-request-fiduciary';
import { TransactionsResponseFiduciary } from '../../app/models/fiducia/transaction-response-fiduciary';

@Injectable()
export class TransactionsProvider {
  constructor(
    public bdbHttpClient: BdbHttpClient,
    private tsError: TsErrorProvider,
    private bdbRsa: BdbRsaProvider
  ) { }

  public getServiceOperationFiduciary(
    path: string,
    bodyFiduciary?: TransactionRequestFiduciary,
  ): Observable<TransactionsResponseFiduciary> {
    return this.bdbHttpClient
      .post<TransactionsResponseFiduciary>(
        path,
        bodyFiduciary,
        ENV.API_FIDUCIARY_URL
      )
      .map((data: TransactionsResponseFiduciary) => {
        return data;
      });
  }
  public getTextFiduciary() {
    const resource = `assets/i18n/es.json`;
    return this.bdbHttpClient.get<any>(
      resource,
      {},
      ENV.FIDUCIARY_API_ASSETS
    );
  }

  buildTransactionsRequest(
    productDetail: ProductDetail,
    customer: Customer,
    startDt: string,
    endDt: string
  ): TransactionRq {
    const account = new Account();
    account.accountNumber = productDetail.productNumberX;
    account.accountType = this.bdbRsa.encrypt(productDetail.productType);
    const transactionRq: TransactionRq = new TransactionRq(
      customer,
      account,
      this.bdbRsa.encrypt(startDt),
      this.bdbRsa.encrypt(endDt)
    );
    return transactionRq;
  }

  public buidlServiceOperationRequestFiduciary(
    numberFund: string,
    typeFund: string,
    startDt: string,
    endDt: string
  ): TransactionRequestFiduciary {
    const fiduciaryBody: TransactionRequestFiduciary = new TransactionRequestFiduciary(
      this.bdbRsa.encrypt(endDt, ENV.FBOG_BAL_YEK_CILBUP_1),
      this.bdbRsa.encrypt(startDt, ENV.FBOG_BAL_YEK_CILBUP_1),
      this.bdbRsa.encrypt(numberFund, ENV.FBOG_BAL_YEK_CILBUP_1),
      this.bdbRsa.encrypt(typeFund, ENV.FBOG_BAL_YEK_CILBUP_1)
    );
    return fiduciaryBody;
  }

  getAccountsLimits(
    getAccountsLimitsRq: GetAccountsLimitsRq
  ): Observable<GetAccountsLimitsRs> {
    return this.bdbHttpClient.post<GetAccountsLimitsRs>(
      'accounts/limits',
      getAccountsLimitsRq
    );
  }

  accountsLimitsUpdate(accountsLimitsUpdateRq: AccountsLimitsUpdateRq) {
    return this.bdbHttpClient.post(
      'accounts/limits/update',
      accountsLimitsUpdateRq
    );
  }

  natAccountsLimitsUpdate(accountsLimitsUpdateRq: AccountsLimitsUpdateRq) {
    return this.bdbHttpClient.post(
      'nataccounts/limits/update',
      accountsLimitsUpdateRq
    );
  }

  getNatAccountsLimits(
    getAccountsLimitsRq: GetAccountsLimitsRq
  ): Observable<GetAccountsLimitsRs> {
    return this.bdbHttpClient.post<GetAccountsLimitsRs>(
      'nataccounts/limits',
      getAccountsLimitsRq
    );
  }

  onError(loading: Loading, ex) {
    loading.dismiss();
    this.tsError.launchErrorModal(ex.error);
  }
}

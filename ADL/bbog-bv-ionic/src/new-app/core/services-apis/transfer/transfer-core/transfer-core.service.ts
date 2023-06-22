import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClientWrapperProvider } from '../../../http/http-client-wrapper/http-client-wrapper.service';
import { DeleteAccountRs, DeleteAccountRq } from './models/delete-account.model';
import { GetAffiliatedAccountsRs } from './models/getAffiliatedAccounts.model';
import { SubscribeTransferAcctRq } from './models/subscribe-transfer-acct.model';
import { ManageOblRq, ManageOblRs } from './models/manage-obl.model';
import { GetPaymentObligationsRs } from './models/payment-obligations.model';

@Injectable()
export class TransferCoreService {

  private PATH_TRANSFER_CORE = 'transfer-core';
  private GET_AFFILIATED_ACCOUNTS_OP = 'get-affiliated-accounts';
  private SUBSCRIBE_TRANSFER_ACCOUNT_OP = 'add-account';
  private DELETE_ACCOUNT_OP = 'delete-account';

  constructor(
    private httpClientWrapperProvider: HttpClientWrapperProvider
  ) { }

  public getCreditCardPaymentObligations(): Observable<GetPaymentObligationsRs> {
    return this.httpClientWrapperProvider
      .postToADLApi({}, `${this.PATH_TRANSFER_CORE}/cc-payment-obligations`);
  }

  public getAffiliatedAccounts(): Observable<GetAffiliatedAccountsRs> {
    return this.httpClientWrapperProvider
      .postToADLApi<any, GetAffiliatedAccountsRs>({}, `${this.PATH_TRANSFER_CORE}/${this.GET_AFFILIATED_ACCOUNTS_OP}`);
  }

  public subscribeTransferAccount(subscribeTransferAcctRq: SubscribeTransferAcctRq): Observable<any> {
    return this.httpClientWrapperProvider
      .postToADLApi(subscribeTransferAcctRq, `${this.PATH_TRANSFER_CORE}/${this.SUBSCRIBE_TRANSFER_ACCOUNT_OP}`);
  }

  public getAVALPaymentObligations(): Observable<GetPaymentObligationsRs> {
    return this.httpClientWrapperProvider.postToADLApi<any, GetPaymentObligationsRs>({}, `${this.PATH_TRANSFER_CORE}/aval-payment-obligations`);
  }

  public getBBOGPaymentObligations(): Observable<GetPaymentObligationsRs> {
    return this.httpClientWrapperProvider.postToADLApi<any, GetPaymentObligationsRs>({}, `${this.PATH_TRANSFER_CORE}/bbog-payment-obligations`);
  }

  public subscribeObligation(subscribeOblRq: ManageOblRq): Observable<ManageOblRs> {
    return this.httpClientWrapperProvider.postToADLApi<ManageOblRq, ManageOblRs>(subscribeOblRq, `${this.PATH_TRANSFER_CORE}/add-payment-obligation`);
  }

  public deleteAccount(body: DeleteAccountRq): Observable<DeleteAccountRs> {
    return this.httpClientWrapperProvider.postToADLApi<DeleteAccountRq, DeleteAccountRs>(body, `${this.PATH_TRANSFER_CORE}/${this.DELETE_ACCOUNT_OP}`);
  }

  public deleteObligation(deleteOblRq: ManageOblRq): Observable<ManageOblRs> {
    return this.httpClientWrapperProvider.postToADLApi<ManageOblRq, ManageOblRs>(deleteOblRq, `${this.PATH_TRANSFER_CORE}/remove-payment-obligation`);
  }
}

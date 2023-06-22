import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GetBalanceRs } from './models/GetBalanceRs';
import { GetBalanceRq } from './models/GetBalanceRq';
import { HttpClientWrapperProvider } from '../../../http/http-client-wrapper/http-client-wrapper.service';
import { GetTransactionHistoryRq } from './models/GetTransactionHistoryRq';
import { GetTransactionHistoryRs } from './models/GetTransactionHistoryRs';
export type BalanceType =
  'savings'
  | 'demand'
  | 'loans'
  | 'credit-card'
  | 'cdt-digital'
  | 'fiduciary'
  | 'certificate'
  | 'batch-inquiry';
@Injectable()
export class ProductsDetailService {
  private PATH_PRODUCTS_DETAIL = 'products-detail/balances';
  constructor(
    private httpClientWrapperProvider: HttpClientWrapperProvider
  ) {
  }
  public getBalance(balanceRq: GetBalanceRq, balanceType: BalanceType): Observable<GetBalanceRs> {
    return this.httpClientWrapperProvider.postToADLApi<GetBalanceRq, GetBalanceRs>(
      balanceRq,
      `${this.PATH_PRODUCTS_DETAIL}/${balanceType}`);
  }
  public getCdtCustomer(): Observable<GetBalanceRs> {
    return this.httpClientWrapperProvider.postToADLApi<GetBalanceRq, GetBalanceRs>(
      {productsInfo: []}, `${this.PATH_PRODUCTS_DETAIL}/v2/cdt-customer`);
  }
  public getTransactionHistory(transactionsRq: GetTransactionHistoryRq): Observable<GetTransactionHistoryRs> {
    return this.httpClientWrapperProvider.postToADLApi<GetTransactionHistoryRq, GetTransactionHistoryRs>(
      transactionsRq, `products-detail/history`);
  }
}

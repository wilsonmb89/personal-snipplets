import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClientWrapperProvider } from '../../../http/http-client-wrapper/http-client-wrapper.service';
import { EnrollCustomCardRq, GenericResponse, GetAllProductsRq, GetAllProductsRs } from './models/products';
import { LoyaltyProgramRs } from './models/LoyaltyProgramRs';
import { GetCardsRq, GetCardsRs } from './models/getCards.dto';
import { TransactionsInquiryRequest, TransactionsInquiryResponse } from './models/loyalty-transactions.model';
import { CdtRenewalRequest } from '@app/modules/products/models/cdt-renewal-request';
import { CdtRenewalResponse } from '@app/modules/products/models/cdt-renewal-response';
import { CreditCardAccountInfoRq, CreditCardAccountInfoRs } from '../../customer-security/models/creditCardAccountInfo';

@Injectable()
export class ProductsService {
  private PRODUCTS_GET_ALL = 'products/get-all';
  private PRODUCTS_LOYALTY_PROGRAM = 'products/loyalty-program';
  private PRODUCTS_LOYALTY_TRANSACTIONS = 'products/loyalty-transactions';
  private PRODUCTS_ENROLL_CUSTOM_CARD = 'products/v2/enroll-custom-card';
  private PRODUCTS_GET_CARDS = 'products/v2/cards';
  private PRODUCTS_ACCOUNT_INFO_CREDIT_CARD = 'products/v2/credit-card/account-info';
  private PRODUCTS_CDT_RENEWAL = 'products/cdt-renewal';

  constructor(
    private httpClientWrapperProvider: HttpClientWrapperProvider
  ) {
  }


  public getAll(request?: GetAllProductsRq): Observable<GetAllProductsRs> {
    return this.httpClientWrapperProvider
      .postToADLApi<any, GetAllProductsRs>(!!request ? request : {}, this.PRODUCTS_GET_ALL);
  }

  public getLoyaltyProgram(): Observable<LoyaltyProgramRs> {
    return this.httpClientWrapperProvider.postToADLApi<any, LoyaltyProgramRs>(
      {}, this.PRODUCTS_LOYALTY_PROGRAM);
  }

  public lookForTransactionsLoyaltyProgram(rq: TransactionsInquiryRequest): Observable<TransactionsInquiryResponse> {
    return this.httpClientWrapperProvider.postToADLApi<TransactionsInquiryRequest, TransactionsInquiryResponse>(
      rq, this.PRODUCTS_LOYALTY_TRANSACTIONS);
  }


  public enrollCustomCard(body: EnrollCustomCardRq): Observable<GenericResponse> {
    return this.httpClientWrapperProvider.postToADLApi(body, this.PRODUCTS_ENROLL_CUSTOM_CARD);
  }

  public getCards(body: GetCardsRq): Observable<GetCardsRs> {
    return this.httpClientWrapperProvider
      .postToADLApi<GetCardsRq, GetCardsRs>(body, this.PRODUCTS_GET_CARDS);
  }

  public cdtRenewal(body: CdtRenewalRequest): Observable<CdtRenewalResponse> {
    return this.httpClientWrapperProvider.postToADLApi(body, this.PRODUCTS_CDT_RENEWAL);
  }

  public creditCardAccountInfo(body: CreditCardAccountInfoRq): Observable<CreditCardAccountInfoRs> {
    return this.httpClientWrapperProvider
      .postToADLApi<CreditCardAccountInfoRq, CreditCardAccountInfoRs>(body, this.PRODUCTS_ACCOUNT_INFO_CREDIT_CARD);
  }

}

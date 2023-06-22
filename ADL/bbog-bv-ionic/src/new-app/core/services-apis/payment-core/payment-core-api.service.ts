import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  CreateBillRq,
  CreateBillRs,
  DeleteInvoiceRq, DeleteInvoiceRs,
  PaymentAgreementRq,
  PaymentAgreementRs
} from './models/payment-agreement.model';
import { HttpClientWrapperProvider } from '../../http/http-client-wrapper/http-client-wrapper.service';
import {
  BillerMngrRequest,
  BillerMngrResponse,
  GetBillersPaymentRs
} from '@app/apis/payment-core/models/billers-payment.model';

@Injectable()
export class PaymentCoreApiService {

  private PATH_PAYMENT_CORE = 'payment-core';

  constructor(
    private httpClientWrapperProvider: HttpClientWrapperProvider
  ) {
  }

  public getBillersPayment(): Observable<GetBillersPaymentRs> {
    return this.httpClientWrapperProvider.postToADLApi({}, `${this.PATH_PAYMENT_CORE}/get-billers-payment`);
  }

  public getPaymentAgreement(paymentAgreementRq): Observable<PaymentAgreementRs> {
    return this.httpClientWrapperProvider.postToADLApi<PaymentAgreementRq, PaymentAgreementRs>(paymentAgreementRq, `${this.PATH_PAYMENT_CORE}/payment-agreement`);
  }

  public deleteBill(rq: BillerMngrRequest): Observable<BillerMngrResponse> {
    return this.httpClientWrapperProvider.postToADLApi<BillerMngrRequest, BillerMngrResponse>(rq, `${this.PATH_PAYMENT_CORE}/delete-bill`);
  }

  public createBill(rq: CreateBillRq): Observable<CreateBillRs> {
    return this.httpClientWrapperProvider.postToADLApi<CreateBillRq, CreateBillRs>(rq, `${this.PATH_PAYMENT_CORE}/create-bill`);
  }

  public getPilaAgreements(): Observable<PaymentAgreementRs> {
    return this.httpClientWrapperProvider.postToADLApi({}, `${this.PATH_PAYMENT_CORE}/get-pila-agreements`);
  }

  public deleteInvoice(rq: DeleteInvoiceRq): Observable<DeleteInvoiceRs> {
    return this.httpClientWrapperProvider.postToADLApi(rq, `${this.PATH_PAYMENT_CORE}/delete-invoice`);
  }


}

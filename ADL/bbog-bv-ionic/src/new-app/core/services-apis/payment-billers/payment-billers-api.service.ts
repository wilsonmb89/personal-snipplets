import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { HttpClientWrapperProvider } from '../../http/http-client-wrapper/http-client-wrapper.service';
import { PayBillRq, PayBillRs } from './models/payment-billers-api.model';
import {
  CheckPaymentTaxRq,
  CheckPaymentTaxRs,
  TaxPayRq,
  PaymentRs,
  GetDistrictTaxRq,
  GetDistrictTaxRs,
  PayDistrictTaxRq,
  PayDistrictTaxRs,
  DistrictTaxCity,
  DistrictTaxAgreement,
  PaymentPilaRq,
  GetBillRq,
  GetBillRs
} from './models/payment-billers-api.model';

@Injectable()
export class PaymentBillersApiService {

  private readonly CONST_PAYMENT_BILLERS_URL = 'payment-billers';
  private readonly CONST_PAY_BILL_OP = 'pay-bill';
  private readonly CONST_DIAN_INQUIRY_OP = 'dian-inquiry';
  private readonly CONST_TAX_PAY_OP = 'pay-dian';
  private readonly CONST_GET_DISTRICT_TAX_OP = 'inquiry-district-tax';
  private readonly CONST_PAY_DISTRICT_TAX_OP = 'pay-tax';
  private readonly CONST_GET_DISTRICT_TAX_CITIES_OP = 'tax-cities';
  private readonly CONST_GET_DISTRICT_TAX_AGREEMENTS_OP = 'taxes-agreement';

  constructor(
    private bdbHttp: HttpClientWrapperProvider
  ) {}

  public payBill(body: PayBillRq): Observable<PayBillRs> {
    return this.bdbHttp
      .postToADLApi<PayBillRq, PayBillRs>(body, `${this.CONST_PAYMENT_BILLERS_URL}/${this.CONST_PAY_BILL_OP}`);
  }

  public checkPaymentTax(body: CheckPaymentTaxRq): Observable<CheckPaymentTaxRs> {
    return this.bdbHttp
      .postToADLApi<CheckPaymentTaxRq, CheckPaymentTaxRs>(body, `${this.CONST_PAYMENT_BILLERS_URL}/${this.CONST_DIAN_INQUIRY_OP}`);
  }

  public taxPay(body: TaxPayRq): Observable<PaymentRs> {
    return this.bdbHttp
      .postToADLApi<TaxPayRq, PaymentRs>(body, `${this.CONST_PAYMENT_BILLERS_URL}/${this.CONST_TAX_PAY_OP}`);
  }

  public pilaPayment(paymentPilaRq: PaymentPilaRq): Observable<PaymentRs> {
    return this.bdbHttp
      .postToADLApi<PaymentPilaRq, PaymentRs>(paymentPilaRq, `${this.CONST_PAYMENT_BILLERS_URL}/pila`);
  }

  public getBill(getBillRq: GetBillRq): Observable<GetBillRs> {
    return this.bdbHttp
      .postToADLApi<GetBillRq, GetBillRs>(getBillRq, `${this.CONST_PAYMENT_BILLERS_URL}/get-bill`);
  }

  public getDistrictTax(body: GetDistrictTaxRq): Observable<GetDistrictTaxRs> {
    return this.bdbHttp
      .postToADLApi<GetDistrictTaxRq, GetDistrictTaxRs>(body, `${this.CONST_PAYMENT_BILLERS_URL}/${this.CONST_GET_DISTRICT_TAX_OP}`);
  }

  public payDistrictTax(body: PayDistrictTaxRq): Observable<PayDistrictTaxRs> {
    return this.bdbHttp
      .postToADLApi<PayDistrictTaxRq, PayDistrictTaxRs>(body, `${this.CONST_PAYMENT_BILLERS_URL}/${this.CONST_PAY_DISTRICT_TAX_OP}`);
  }

  public getDistrictTaxCities(): Observable<DistrictTaxCity[]> {
    return this.bdbHttp
      .postToADLApi<any, {cities: DistrictTaxCity[]}>
        ({}, `${this.CONST_PAYMENT_BILLERS_URL}/${this.CONST_GET_DISTRICT_TAX_CITIES_OP}`)
      .pipe(map(res => res.cities));
  }

  public getDistrictTaxAgreements(cityId: string): Observable<DistrictTaxAgreement[]> {
    return this.bdbHttp
      .postToADLApi<{cityId: string}, {taxesAgreements: DistrictTaxAgreement[]}>
        ({ cityId }, `${this.CONST_PAYMENT_BILLERS_URL}/${this.CONST_GET_DISTRICT_TAX_AGREEMENTS_OP}`)
      .pipe(map(res => res.taxesAgreements));
  }
}

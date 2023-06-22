import { Injectable } from '@angular/core';
import { HttpClientWrapperProvider } from '../../http/http-client-wrapper/http-client-wrapper.service';
import { Observable } from 'rxjs/Observable';
import { DonationRq, DonationRs } from './models/donations.model';
import { ObligationPaymentRq, ObligationPaymentRs } from './models/obligation-payment.model';
import { FacipassRechargeRq, FacipassRechargeRs } from './models/facilpass-recharge.model';
import { ExtraordinaryPaymentRq, ExtraordinaryPaymentRs } from '@app/apis/payment-nonbillers/models/extraordinary-payment.model';

@Injectable()
export class PaymentNonBillersApiService {

  private PATH_PAYMENT_NONBILLERS = 'payment-nonbillers';

  constructor(
    private httpClientWrapperProvider: HttpClientWrapperProvider
  ) { }

  public applyDonation(rq: DonationRq): Observable<DonationRs> {
    return this.httpClientWrapperProvider.postToADLApi<DonationRq, DonationRs>(
      rq, `${this.PATH_PAYMENT_NONBILLERS}/donations`
    );
  }

  public doPayment(loanPaymentRq: ObligationPaymentRq): Observable<ObligationPaymentRs> {
    return this.httpClientWrapperProvider.postToADLApi(loanPaymentRq, `${this.PATH_PAYMENT_NONBILLERS}/loan-payment`);
  }

  public facilpassRecharge(body: FacipassRechargeRq): Observable<FacipassRechargeRs> {
    return this.httpClientWrapperProvider.postToADLApi<FacipassRechargeRq, FacipassRechargeRs>(
      body, `${this.PATH_PAYMENT_NONBILLERS}/facilpass-recharge`
    );
  }

  public checkExtraOrdinaryPayment(extraPaymentRq: ExtraordinaryPaymentRq): Observable<ExtraordinaryPaymentRs> {
      return this.httpClientWrapperProvider.postToADLApi(extraPaymentRq, `${this.PATH_PAYMENT_NONBILLERS}/extraordinary-payments`);
  }

}

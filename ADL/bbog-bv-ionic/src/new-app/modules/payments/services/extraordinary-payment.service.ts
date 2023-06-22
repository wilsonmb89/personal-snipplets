import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {PaymentNonBillersApiService} from '@app/apis/payment-nonbillers/payment-nonbillers-api.service';
import {DepAcctId, ExtraordinaryPaymentRq, ExtraordinaryPaymentRs} from '@app/apis/payment-nonbillers/models/extraordinary-payment.model';
import {LoanPaymentInfo} from '../../../../app/models/credits/loan-payment-info';
import {ProductDetail} from '../../../../app/models/products/product-model';

@Injectable()
export class ExtraordinaryPaymentService {

    constructor(
        private paymentNonBillersApiService: PaymentNonBillersApiService
    ) { }

  private buildCheckExtraPaymentRq(flag: string, paymentInfo: LoanPaymentInfo | ProductDetail): ExtraordinaryPaymentRq {
    if (flag === 'bdbCardDetail') {
      return {
        depAcctId: this.buildDepAcctIdFromProductDetail(paymentInfo)
      };
    } else if (flag === 'loanDestinationAcct') {
      return {
        depAcctId: this.buildDepAcctIdFromLoanPaymentInfo(paymentInfo)
      };
    }
  }

  private buildDepAcctIdFromProductDetail(paymentInfo): DepAcctId {
      return {
        acctId: paymentInfo.productDetailApi.productNumber,
        acctType: paymentInfo.productDetailApi.productBankType,
        subProduct: paymentInfo.productDetailApi.productBankSubType
      };
  }

  private buildDepAcctIdFromLoanPaymentInfo(loanPaymentInfo: any): DepAcctId {
      return {
        acctId: loanPaymentInfo.loan.accountOwned.productDetailApi.productNumber,
        acctType: loanPaymentInfo.loan.accountOwned.productDetailApi.productBankType,
        subProduct: loanPaymentInfo.loan.accountOwned.productDetailApi.productBankSubType
      };
  }

  public checkExtraPayment(flag: string, paymentInfo: LoanPaymentInfo | ProductDetail): Observable<ExtraordinaryPaymentRs> {
        return this.paymentNonBillersApiService.checkExtraOrdinaryPayment(this.buildCheckExtraPaymentRq(flag, paymentInfo));
    }

}

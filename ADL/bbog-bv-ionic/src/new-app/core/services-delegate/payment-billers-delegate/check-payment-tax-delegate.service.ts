import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CheckPaymentTaxRq, CheckPaymentTaxRs } from '@app/apis/payment-billers/models/payment-billers-api.model';
import { PaymentBillersApiService } from '@app/apis/payment-billers/payment-billers-api.service';
import { DianTaxInfo } from '@app/modules/payments/models/taxes-info';

@Injectable()
export class CheckPaymentTaxDelegateService {

  constructor(
    private paymentBillersApiService: PaymentBillersApiService
  ) {}

  public checkPaymentTax(dianTaxInfo: DianTaxInfo): Observable<CheckPaymentTaxRs> {
    const checkPaymentTaxRq = this.buildCheckPaymentTaxRq(dianTaxInfo);
    return this.paymentBillersApiService.checkPaymentTax(checkPaymentTaxRq);
  }

  private buildCheckPaymentTaxRq(dianTaxInfo: DianTaxInfo): CheckPaymentTaxRq {
    const checkPaymentTaxRq = new CheckPaymentTaxRq();
    checkPaymentTaxRq.pmtCodServ = (dianTaxInfo.taxInfo.taxCode === 'T') ? 'Tributary' : 'Customs';
    checkPaymentTaxRq.invoiceNum = dianTaxInfo.taxInfo.invoiceNum;
    checkPaymentTaxRq.govIssueIdentType = '';
    checkPaymentTaxRq.identSerialNum = '';
    return checkPaymentTaxRq;
  }
}

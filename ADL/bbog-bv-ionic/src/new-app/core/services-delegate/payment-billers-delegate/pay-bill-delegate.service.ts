import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ENV } from '@app/env';
import { BillPaymentInfo } from '../../../../app/models/bills/bill-payment-info';
import { Account, PayBillRq, PayBillRs } from '../../services-apis/payment-billers/models/payment-billers-api.model';
import { PaymentBillersApiService } from '../../services-apis/payment-billers/payment-billers-api.service';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';

@Injectable()
export class PayBillDelegateService {

  constructor(
    private paymentBillersApiService: PaymentBillersApiService,
    private bdbUtils: BdbUtilsProvider,
  ) {}

  public payBill(billPaymentInfo: BillPaymentInfo): Observable<PayBillRs> {
    const payBillRq = this.buildPayBillRq(billPaymentInfo);
    return this.paymentBillersApiService.payBill(payBillRq);
  }

  private buildPayBillRq(billPaymentInfo: BillPaymentInfo): PayBillRq {
    const bill = billPaymentInfo.bill;
    const payBillRq = new PayBillRq();
    payBillRq.amount = Number(billPaymentInfo.amount);
    payBillRq.codeService =
      ENV.WITH_NURA ?
      this.bdbUtils.pad(bill.orgIdNum, 8) : bill.orgIdNum;
    payBillRq.invoiceNum = bill.invoiceNum;
    payBillRq.codeNIE = bill.nie;
    payBillRq.account = new Account();
    payBillRq.account.accountNumber = billPaymentInfo.account.productNumberApi;
    payBillRq.account.accountType = this.bdbUtils.mapTypeProduct(billPaymentInfo.account.productType);
    return payBillRq;
  }

}

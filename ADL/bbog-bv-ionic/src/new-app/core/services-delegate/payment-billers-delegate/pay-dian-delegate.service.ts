import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Account, TaxPayRq, PaymentRs } from '../../services-apis/payment-billers/models/payment-billers-api.model';
import { PaymentBillersApiService } from '../../services-apis/payment-billers/payment-billers-api.service';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { DianTaxInfo } from '../../../modules/payments/models/taxes-info';

@Injectable()
export class PayDianDelegateService {

  constructor(
    private paymentBillersApiService: PaymentBillersApiService,
    private bdbUtils: BdbUtilsProvider,
  ) {}

  public taxPay(dianTaxInfo: DianTaxInfo): Observable<PaymentRs> {
    const taxPayRq = this.buildTaxPayRq(dianTaxInfo);
    return this.paymentBillersApiService.taxPay(taxPayRq);
  }

  private buildTaxPayRq(dianTaxInfo: DianTaxInfo): TaxPayRq {
    const account = new Account();
    const taxPayRq = new TaxPayRq();
    account.accountNumber = dianTaxInfo.accountOrigin.productNumberApi;
    account.accountType = this.bdbUtils.mapTypeProduct(dianTaxInfo.accountOrigin.productType);
    taxPayRq.account = account;
    taxPayRq.invoiceType = dianTaxInfo.taxInfoDetail.invoiceType;
    taxPayRq.invoiceNum = dianTaxInfo.taxInfoDetail.invoiceNum;
    taxPayRq.govIssueIdentType = dianTaxInfo.taxInfoDetail.govIssueIdentType;
    taxPayRq.identSerialNum = dianTaxInfo.taxInfoDetail.identSerialNum;
    taxPayRq.totalCurAmt = dianTaxInfo.taxInfoDetail.totalCurAmt;
    taxPayRq.feeAmt = dianTaxInfo.taxInfoDetail.feeAmt;
    taxPayRq.expDt = `${dianTaxInfo.taxInfoDetail.expDt}T00:00:00`;
    taxPayRq.taxType = 'IVA';
    taxPayRq.taxTypeInvoice = dianTaxInfo.taxInfoDetail.taxType;
    taxPayRq.taxInfoAmt = '0.00';
    taxPayRq.pmtPeriod = dianTaxInfo.taxInfoDetail.pmtPeriod;
    return taxPayRq;
  }
}

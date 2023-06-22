import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { Observable } from 'rxjs/Observable';
import { BillInfo } from '../../app/models/bills/bill-info';
import { ProductDetail } from '../../app/models/products/product-model';
import { SchedBillAdd } from '../../app/models/sched-bill/sched-bill.model';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbEventsConstants } from '../../app/models/analytics-event/bdb-transactions-code';
import { RequestEvents } from '../../app/models/analytics-event/request-event';

@Injectable()
export class BillOpsProvider {

  constructor(
    public bdbHttpClient: BdbHttpClient,
    private bdbRsa: BdbRsaProvider,
    private bdbUtils: BdbUtilsProvider
  ) {
  }


  schedBill(rq: SchedBillAdd, url: string): Observable<any> {
    return this.bdbHttpClient.post<any>(
      url, rq, ENV.API_GATEWAY_ADL_URL, null, new RequestEvents(BdbEventsConstants.manager.inscriptions));
  }


  buildScheduleBillRq(
    bill: BillInfo,
    schedInfo: { days: string, frequency: string, maxAmount: number, originAccount: ProductDetail },
    accountList: any
  ) {

    const originAccount = accountList.filter((e, i) => i + 1 === +schedInfo.originAccount);
    let daysBeAft = '';
    if (schedInfo.days !== 'def') {
      daysBeAft = schedInfo.days;
    }
    return {
      daysBefAft: (daysBeAft === '') ? '0' : daysBeAft,
      bill: {
        nickname: bill.nickname,
        nie: bill.nie,
        orgId: bill.orgIdNum,
        refId: bill.invoiceNum
      },
      account: {
        accountNumber: originAccount[0].productNumber,
        accountType: this.bdbUtils.mapTypeProduct(originAccount[0].productType)
      },
      maxAmount: schedInfo.maxAmount.toString(),
      pmtType: schedInfo.frequency
    };
  }

}

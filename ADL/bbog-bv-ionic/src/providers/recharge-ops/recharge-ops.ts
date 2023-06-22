import { Injectable } from '@angular/core';
import { RechargeInfo } from '../../app/models/recharges/recharge-info';
import { ModalRs } from '../../app/models/modal-rs/modal-rs';
import { RechargeRq } from '../../app/models/recharges/recharge-rq';
import { BankAccount } from '../../app/models/recharges/bank-account';
import { RechargePaymentInfo } from '../../app/models/recharges/payment-info';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { Observable } from 'rxjs/Observable';
import { ENV } from '@app/env';
import { RequestEvents } from '../../app/models/analytics-event/request-event';
import { BdbEventsConstants } from '../../app/models/analytics-event/bdb-transactions-code';

@Injectable()
export class RechargeOpsProvider {

  constructor(
    private bdbUtils: BdbUtilsProvider,
    private bdbHttpClient: BdbHttpClient
  ) {}

  doRecharge(rechargeInfo: RechargeInfo): Observable<ModalRs> {
    const rechargeRq: RechargeRq = this.buildRq(rechargeInfo);
    const aditionalInfo = this.buildAdditionalInfo(rechargeInfo);
    return this.bdbHttpClient.post<ModalRs>(
      'payment-nonbillers/recharges',
      rechargeRq,
      ENV.API_GATEWAY_ADL_URL,
      null, new RequestEvents(BdbEventsConstants.collected.recharge, aditionalInfo));
  }

  public buildRq(rechargeInfo: RechargeInfo): RechargeRq {
    const account = new BankAccount(
      rechargeInfo.account.productNumber,
      this.bdbUtils.mapTypeProduct(rechargeInfo.account.productType));

    const paymentInfo = new RechargePaymentInfo(rechargeInfo.phoneNumber,
      rechargeInfo.amount,
      rechargeInfo.carrier.cod);
    return new RechargeRq(account, paymentInfo);
  }

  private buildAdditionalInfo(rechargeInfo: RechargeInfo): Object[] {
    const aditionalInfo = [];
    aditionalInfo.push({'key': 'operatorCode', 'value': rechargeInfo.carrier.cod});
    aditionalInfo.push({'key': 'operator', 'value': rechargeInfo.carrier.value});
    aditionalInfo.push({'key': 'value', 'value': rechargeInfo.amount || '0'});
    aditionalInfo.push({'key': 'phoneNumber', 'value': rechargeInfo.phoneNumber || ''});
    return aditionalInfo;
  }

}

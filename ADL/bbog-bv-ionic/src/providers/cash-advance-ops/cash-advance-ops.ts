import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CashAdvanceRq } from '../../app/models/cash-advance/cash-advance-rq';
import { ModalRs } from '../../app/models/modal-rs/modal-rs';
import { CashAdvanceInfo } from 'app/models/cash-advance/cash-advance-info';
import { LoadingController, NavController } from 'ionic-angular';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { Account } from '../../app/models/fiducia/account';
import { TimeoutProvider } from '../../providers/timeout/timeout';
import { RequestEvents } from '../../app/models/analytics-event/request-event';
import { BdbEventsConstants } from '../../app/models/analytics-event/bdb-transactions-code';
import { ENV } from '@app/env';
import { TrxResultCashAdvanceService } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-advance.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';

@Injectable()
export class CashAdvanceOpsProvider {

  constructor(
    public bdbHttpClient: BdbHttpClient,
    private bdbUtils: BdbUtilsProvider,
    private bdbRsa: BdbRsaProvider,
    private timeoutProvider: TimeoutProvider,
    private txResultService: TrxResultCashAdvanceService,
  ) { }

  cashAdvance(rq: CashAdvanceRq, analyticsInfo: RequestEvents): Observable<ModalRs> {
    return this.bdbHttpClient.post<ModalRs>(
      `card/advance${this.timeoutProvider.addParameterIdempotencyKey()}`,
      rq,
      ENV.API_URL,
      null,
      analyticsInfo
    );
  }

  sendCashAdvance(cashInfo: CashAdvanceInfo, pin: string, loading: LoadingController, navCtrl: NavController) {

    const cashInfoRq = this.buildRq(cashInfo, pin);
    const analyticsInfo = this.buildAnalyticsInfo(cashInfo);
    const loader = loading.create();
    loader.present();

    this.cashAdvance(cashInfoRq, analyticsInfo).subscribe(
      (data: ModalRs) => {
        loader.dismiss();
        this.buildResultData(cashInfo, true, data.authCode, navCtrl);
      },
      (ex) => {
        loader.dismiss();
        this.buildResultData(cashInfo, false, '', navCtrl, ex.error ? ex.error : null);
      }
    );
  }

  buildRq(cashInfo: CashAdvanceInfo, pin: string): CashAdvanceRq {
    const cashAdvanceRq = new CashAdvanceRq();
    let account = new Account();
    account.accountNumber = cashInfo.creditCard.productNumberX;
    account.accountSubType = this.bdbRsa.encrypt(cashInfo.creditCard.productType);
    account.accountType = this.bdbRsa.encrypt(this.bdbUtils.mapTypeProduct(cashInfo.creditCard.productType));
    // account from
    cashAdvanceRq.accountFrom = account;
    account = new Account();
    account.accountNumber = cashInfo.account.productNumberX;
    account.accountType = this.bdbRsa.encrypt(this.bdbUtils.mapTypeProduct(cashInfo.account.productType));
    // account to
    cashAdvanceRq.accountTo = account;
    // set amount
    cashAdvanceRq.amt = cashInfo.amount;
    // set pin
    if (pin) {
      cashAdvanceRq.assertion = this.bdbRsa.encrypt(pin);
    } else {
      cashAdvanceRq.assertion = '';
    }
    // set customer
    cashAdvanceRq.customer = this.bdbUtils.getCustomer();
    return cashAdvanceRq;
  }

  private buildAnalyticsInfo(cashInfo: CashAdvanceInfo): RequestEvents {
    const aditionalInfo = [];
    aditionalInfo.push({ 'key': 'accOriginNumber', 'value': cashInfo.creditCard.productNumber });
    aditionalInfo.push({ 'key': 'accOriginType', 'value': cashInfo.creditCard.productType });
    aditionalInfo.push({ 'key': 'accOriginName', 'value': cashInfo.creditCard.productName });
    aditionalInfo.push({ 'key': 'accOriginBankName', 'value': cashInfo.creditCard.productBank });
    aditionalInfo.push({ 'key': 'accDestinationNumber', 'value': cashInfo.account.productNumber });
    aditionalInfo.push({ 'key': 'accDestinationType', 'value': cashInfo.account.productType });
    aditionalInfo.push({ 'key': 'accDestinationName', 'value': cashInfo.account.productName });
    aditionalInfo.push({ 'key': 'accDestinationBankName', 'value': cashInfo.account.productBank });
    aditionalInfo.push({ 'key': 'amount', 'value': cashInfo.amount });
    return new RequestEvents(BdbEventsConstants.uses.cash, aditionalInfo);
  }

  private buildResultData(
    cashInfo: CashAdvanceInfo,
    isSuccess: boolean,
    approvalId: string = '',
    navCtrl: NavController,
    errorData?: ApiGatewayError,
  ): void {
    const state: TransactionResultState = !isSuccess ? 'error' : 'success';
    this.txResultService.launchResultTransfer(navCtrl, state, cashInfo, approvalId, errorData);
  }
}

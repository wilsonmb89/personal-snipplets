import { Injectable } from '@angular/core';
import { EnrolledProductsRs } from '../../app/models/enrolled-products-rs';
import { AccountBalance } from '../../app/models/enrolled-transfer/account-balance';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { Observable } from 'rxjs/Observable';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { ModalRs } from '../../app/models/modal-rs/modal-rs';
import { AcctEnrollRq } from '../../app/models/transfers/acct-enroll-rq';
import { EnrollProduct } from '../../app/models/transfers/subscribe-acct';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { ENV } from '@app/env';
import { RequestEvents } from '../../app/models/analytics-event/request-event';
import { BdbEventsConstants } from '../../app/models/analytics-event/bdb-transactions-code';
import {SubscribeTransferAcctRq} from '../../new-app/core/services-apis/transfer/transfer-core/models/subscribe-transfer-acct.model';
import {SubscribeTransferAcctService} from '../../new-app/modules/transfers/services/subscribe-transfer-acct.service';

@Injectable()
export class EnrolledAccountOpsProvider {

  constructor(
    private bdbHttpClient: BdbHttpClient,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbUtils: BdbUtilsProvider,
    private bdbRsa: BdbRsaProvider,
    private subscribeTransferAcctService: SubscribeTransferAcctService
  ) { }

  enrollNewAccount(subscribeAcct: SubscribeTransferAcctRq): Observable<ModalRs> {
    return this.subscribeTransferAcctService.subscribeTransferAcct(subscribeAcct);
  }

  buildEnrollRq(acctInfo: EnrollProduct) {
    const acctEnrollRq: AcctEnrollRq = new AcctEnrollRq();
    acctEnrollRq.customer = this.bdbUtils.getCustomer();
    acctEnrollRq.acctInfo = acctInfo;
    acctEnrollRq.operationType = this.bdbRsa.encrypt('A');
    return acctEnrollRq;
  }

  getAccountsEnrolled(): Observable<AccountBalance[]> {
    return this.bdbHttpClient.get<EnrolledProductsRs>(
      'accounts/transfer/_search', {}, ENV.API_URL, new RequestEvents (BdbEventsConstants.manager.transfEnrolled) ).map((e) => {
      return e.acctBalancesList;
    }).flatMap(
      (data: Array<AccountBalance>) => {
        this.bdbInMemory.setItemByKey(InMemoryKeys.EnrolledAccountsList, data);
        return Observable.of(data);
      }
    );
  }

}

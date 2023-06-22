import { Injectable } from '@angular/core';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { AcctEnrollRq } from '../../app/models/transfers/acct-enroll-rq';
import { Observable } from 'rxjs/Observable';
import { ModalRs } from '../../app/models/modal-rs/modal-rs';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { LoadingController } from 'ionic-angular';
import { AccountBalance } from '../../app/models/enrolled-transfer/account-balance';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { EnrollProvider } from '../enroll/enroll';

@Injectable()
export class AccountOpsProvider {

  constructor(
    public bdbHttpClient: BdbHttpClient,
    private bdbUtils: BdbUtilsProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private loadingCtrl: LoadingController,
    private bdbRsa: BdbRsaProvider,
    private enrollProvider: EnrollProvider
  ) {
  }

  enroll(acctEnrollRq: AcctEnrollRq): Observable<ModalRs> {
    return this.bdbHttpClient.post<ModalRs>('mgmt/account', acctEnrollRq);
  }

  manageAccount(
    account: AccountBalance,
    operation: string,
    next?: (value: any) => void,
    error?: (error: any) => void
  ) {
    const loading = this.loadingCtrl.create();
    loading.present().then(() => {
      this.enroll(this.enrollProvider.buildEnrollRq(account, operation)).subscribe(
          data => {
            this.bdbUtils.dismiss(data, loading);
            next(data);
          },
          err => {
            this.bdbUtils.dismiss(err, loading);
            error(err);
          });
    });
  }

}

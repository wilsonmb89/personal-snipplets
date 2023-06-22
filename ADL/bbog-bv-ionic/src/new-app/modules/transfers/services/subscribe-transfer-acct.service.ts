import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TransferCoreService} from '../../../core/services-apis/transfer/transfer-core/transfer-core.service';
import {SubscribeTransferAcctRq} from '../../../core/services-apis/transfer/transfer-core/models/subscribe-transfer-acct.model';

@Injectable()
export class SubscribeTransferAcctService {

  constructor(
    private transferCoreService: TransferCoreService
  ) {
  }

  public subscribeTransferAcct(subscribeAcct: SubscribeTransferAcctRq): Observable<any> {
    return this.transferCoreService.subscribeTransferAccount(subscribeAcct);
  }

}

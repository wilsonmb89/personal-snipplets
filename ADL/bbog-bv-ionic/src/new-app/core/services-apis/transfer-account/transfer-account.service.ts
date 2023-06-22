import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClientWrapperProvider } from '../../http/http-client-wrapper/http-client-wrapper.service';
import { DoTransferRq, DoTransferRs } from './models/doTrasfer.model';

@Injectable()
export class TransferAccountService {

  constructor(
    private bdbHttp: HttpClientWrapperProvider
  ) { }

  private TRANSFER_ACCOUNT_PATH = 'transfer-account';

  public doTransfer(doTransferRq: DoTransferRq): Observable<DoTransferRs> {
    return this.bdbHttp.postToADLApi<DoTransferRq, DoTransferRs>(doTransferRq, `${this.TRANSFER_ACCOUNT_PATH}/do-transfer`);
  }

  public doInvestment(doTransferRq: DoTransferRq): Observable<DoTransferRs> {
    return this.bdbHttp.postToADLApi<DoTransferRq, DoTransferRs>(doTransferRq, `${this.TRANSFER_ACCOUNT_PATH}/do-investment`);
  }

  public doDivestment(doTransferRq: DoTransferRq): Observable<DoTransferRs> {
    return this.bdbHttp.postToADLApi<DoTransferRq, DoTransferRs>(doTransferRq, `${this.TRANSFER_ACCOUNT_PATH}/do-divestment`);
  }

  public useLoan(doTransferRq: DoTransferRq): Observable<DoTransferRs> {
    return this.bdbHttp.postToADLApi<DoTransferRq, DoTransferRs>(doTransferRq, `${this.TRANSFER_ACCOUNT_PATH}/use-loan`);
  }

}

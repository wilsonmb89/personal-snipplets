import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ENV } from '@app/env';
import { BankReferenceRq } from '../../app/models/bank-reference/bank-reference-rq';
import { BankReferenceRs } from '../../app/models/bank-reference/bank-reference-rs';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';

@Injectable()
export class BankReferenceProvider {

  constructor(
    private bdbHttpClient: BdbHttpClient
  ) { }

  public getBankReference(rq: BankReferenceRq): Observable<BankReferenceRs> {
    return this.bdbHttpClient.post('api-gateway/banking-reports/references', rq, ENV.API_ADL_URL);
  }

}

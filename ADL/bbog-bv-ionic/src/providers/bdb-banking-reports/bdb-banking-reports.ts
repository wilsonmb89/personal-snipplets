import { Injectable } from '@angular/core';
import { BdbHttpClient } from '../../providers/bdb-http-client/bdb-http-client';
import { AccountReferenceRq, AccountReference, CustomerReference, AccountReferenceRs } from './bdb-banking-reports-models';
import { ENV } from '@app/env';

@Injectable()
export class BdbBankingReportsProvider {

  constructor(
    private bdbHttpClient: BdbHttpClient
  ) {}

  getAccountsReferences(body: AccountReferenceRq) {
    return this.bdbHttpClient.post<AccountReferenceRs>('banking-reports/references', body, ENV.API_GATEWAY_ADL_URL);
  }

}

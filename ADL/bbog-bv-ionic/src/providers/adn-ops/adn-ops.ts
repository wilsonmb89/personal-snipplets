import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BdbHttpClient} from '../../providers/bdb-http-client/bdb-http-client';
import {ENV} from '@app/env';
import {InMemoryKeys} from '../storage/in-memory.keys';
import {BdbInMemoryProvider} from '../storage/bdb-in-memory/bdb-in-memory';

@Injectable()
export class AdnOpsProvider {

  constructor(private http: BdbHttpClient,
              private bdbInMemory: BdbInMemoryProvider) {

  }

  public availableToAdn(accountNumber: string): Observable<any> {

    const header = {
      'X-RqUID': this.bdbInMemory.getItemByKey(InMemoryKeys.UUID),
      'X-Channel': 'BANCAVIRTUAL'
    };

    return this.http.post('customer/validate-accounts', {accountNumber}, ENV.API_ADN_URL, header);
  }
}

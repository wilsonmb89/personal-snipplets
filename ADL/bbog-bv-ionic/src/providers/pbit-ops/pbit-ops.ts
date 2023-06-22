import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClientWrapperProvider } from '../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';

/*
  Generated class for the PbitProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PbitOpsProvider {
  constructor(public httpClientWrapper: HttpClientWrapperProvider) {}

  public dataRedirect(fullName: string): Observable<any> {
    return this.httpClientWrapper.postToADLApi<any, any>(
      { fullName },
      'internal-transfer/pbit/get-session'
    );
  }
}

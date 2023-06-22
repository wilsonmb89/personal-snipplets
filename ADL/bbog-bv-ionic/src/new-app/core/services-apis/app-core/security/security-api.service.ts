import { Injectable } from '@angular/core';
import { HttpClientWrapperProvider } from '../../../http/http-client-wrapper/http-client-wrapper.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ENV } from '@app/env';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class SecurityApiService {

  constructor(private httpClientWrapperProvider: HttpClientWrapperProvider) {}

  public getPublicKey(): Observable<{ publicKey: string; diffTime: number }> {
    const options = { responseType: 'text', observe: 'response' };
    return this.httpClientWrapperProvider
      .postOptions<string>(
        'setup/start',
        null,
        ENV.API_GATEWAY_ADL_URL,
        options
      )
      .pipe(
        map((response: HttpResponse<string>) => ({
          publicKey: response.body,
          diffTime:
            Number(response.headers.get('Last-Modified')) -
            new Date().getTime(),
        }))
      );
  }
}

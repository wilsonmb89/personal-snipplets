import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SecureAuthResponse } from './secure-auth-response';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { AuthenticatorResponse } from './authenticator-response';
import { ENV } from '@app/env';
import { UserLastConnectRq } from '../../app/models/user-last-connect';
import { TokenValidationRq } from '../../app/models/token/token-validation-rq';
import { BdbInMemoryIonicProvider } from '../bdb-in-memory-ionic/bdb-in-memory-ionic';
import { BdbCookies } from '../bdb-cookie/bdb-cookie';
import { BdbEventsConstants } from '../../app/models/analytics-event/bdb-transactions-code';
import { RequestEvents } from '../../app/models/analytics-event/request-event';

// TO DO Delete this class

@Injectable()
export class AuthenticatorProvider {

  constructor(
    private bdbRsaProvider: BdbRsaProvider,
    private bdbHttpClient: BdbHttpClient,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbInMemoryIonic: BdbInMemoryIonicProvider,
    private bdbCookie: BdbCookies
  ) {
  }

  public getAuthentication(uuid: string): Observable<SecureAuthResponse> {
    return this.bdbHttpClient.post<SecureAuthResponse>('/auth/secure/uuid', {
      uuid
    }, ENV.API_URL, null,
      new RequestEvents(BdbEventsConstants.security.uuid)
    );
  }

  private getHeaders() {
    const virtualBankingIdentifier = '6';

    const headers = {
      'channel': 'office',
      'product': virtualBankingIdentifier
    };

    return headers;
  }
 // TO DO Verificar si estos métodos se necesitan
  sendOtp(documentType: string, documentNumber) {
    const resource = `/authentication/send-otp?documentType=${documentType}&documentNumber=${documentNumber}`;
    return this.bdbHttpClient.get<AuthenticatorResponse>(
      resource, {},
      ENV.API_AUTH_ENDPOINT_URL,
      new RequestEvents(BdbEventsConstants.security.sendOtp),
    ).subscribe(
      (data) => {
      },
      (exc) => {
      }
    );
  }

  validateOtp(documentType: string, documentNumber: string, otp: string): Observable<any> {
    const tokenValidationDTO = new TokenValidationRq(documentType, documentNumber, otp);
    return this.bdbHttpClient.post<AuthenticatorResponse>
      ('authentication/otp',
        tokenValidationDTO,
        ENV.API_AUTH_ENDPOINT_URL,
        this.getHeaders(),
        new RequestEvents(BdbEventsConstants.security.validateOtp)
      );
  }

  requestRsa(actionCode: string): boolean {
    return actionCode !== 'ALLOW';
  }

  setLastConnect(user: UserLastConnectRq) {
    user.id = this.bdbRsaProvider.encrypt(user.id);
    user.ip = this.bdbRsaProvider.encrypt(user.ip);


    return this.bdbHttpClient.post<any>('user-last-connect', user, ENV.API_URL)
      .catch((err: HttpErrorResponse) => {
        return this.callResponse(err);
      });
  }

  private callResponse(err): Observable<any> {
    if (err.status === 200) {
      const res = new HttpResponse({
        body: null,
        headers: err.headers,
        status: err.status,
        statusText: err.statusText,
        url: err.url
      });

      return Observable.of(res);
    } else {
      return Observable.throw(err);
    }
  }

  setDeviceTokenCookie(deviceTokenCookie: string) {
    this.bdbInMemory.setItemByKey(InMemoryKeys.UUID_THREAT, deviceTokenCookie);
    this.bdbCookie.setCookie(InMemoryKeys.UUID_THREAT, deviceTokenCookie, 365);
  }

}

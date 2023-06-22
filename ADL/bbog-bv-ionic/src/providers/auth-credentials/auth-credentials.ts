import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthCredentialsResponse } from './authentication-credentials';
import { ENV } from '@app/env';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';

@Injectable()
export class AuthCredentialsProvider {

  constructor(public http: HttpClient,
    public bdbInMemoryProvider: BdbInMemoryProvider) {
  }

  public getAuthentication() {

    this.bdbInMemoryProvider.clearAll();

    const actualUrl =
    window.location.href;

    const actualUrlSplit =
    actualUrl.split('=');

    const documentNumber =
    actualUrlSplit[1];
    this.getCredentialsAuth(documentNumber)
    .subscribe(data => {
      this.setSessionStorage(data);
    },
    err => {
      console.error(err);
    });
  }

  public getCredentialsAuth(documentNumber: string) {
    return this.http.get<AuthCredentialsResponse>(`${ENV.API_AUTH_ENDPOINT_URL}authentication/cifin/get-dispatch?documentNumber=${documentNumber}`);
  }

  protected setSessionStorage(data) {
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.AccessToken, data.accessToken);
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.IdentificationType, 'C');
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.IdentificationNumber, data.identityNumber);
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.AccessType, data.accessType);
  }

}

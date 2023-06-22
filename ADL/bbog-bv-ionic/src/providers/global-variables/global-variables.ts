import { Injectable } from '@angular/core';
import { ENV } from '@app/env';

@Injectable()
export class GlobalVariablesProvider {

  public savingsAcct = 'SDA';
  public creditCard = 'CCA';

  constructor() {
  }

  public get apiUrl(): string {
    return ENV.API_URL;
  }

  public get  authenticatorUrl(): string {
    return ENV.AUTH_URL;
  }

  public get adlApiUrl(): string {
    return ENV.API_ADL_URL;
  }
}

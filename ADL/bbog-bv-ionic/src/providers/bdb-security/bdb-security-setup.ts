import { Injectable } from '@angular/core';
import { BdbHttpClient } from '../../providers/bdb-http-client/bdb-http-client';
import { ENV } from '@app/env';
import { BdbSecurityRestProvider } from '../../providers/bdb-security/bdb-security-rest';
import { HttpResponse } from '@angular/common/http';

/**
 Eliminar y cambiar donde se usa por lo del nuevo modulo
 */
@Injectable()
export class BdbSecuritySetupProvider {

  constructor(
    private bdbHttpClient: BdbHttpClient,
    private bdbSecurityRest: BdbSecurityRestProvider
  ) { }

  async getPublicBackKey() {
    return new Promise((res: any) => {

      const options = {
        responseType: 'text',
        observe: 'response'
      };

      this.bdbHttpClient.postOptions(
        'setup/start', null, ENV.API_GATEWAY_ADL_URL, options
      ).subscribe(
        (setupSecurity) => {
          this.bdbSecurityRest.storePublickKey(setupSecurity);
          res(true);
        },
        () => {
          res(false);
        }
      );
    });
  }
}

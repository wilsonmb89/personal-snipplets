import { Injectable } from '@angular/core';
import { Recoverable } from 'repl';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { Observable } from 'rxjs/Observable';
import { ENV } from '@app/env';
import { ModalRs } from '../../app/models/modal-rs/modal-rs';
import { RequestEvents } from '../../app/models/analytics-event/request-event';
import { BdbEventsConstants } from '../../app/models/analytics-event/bdb-transactions-code';

@Injectable()
export class PinProvider {

  constructor(private bdbRsaProvider: BdbRsaProvider,
    private bdbHttpClient: BdbHttpClient,
  ) {
  }

  add(documentType: string, documentNumber: string, pin: number): Observable<ModalRs> {

    const bodyParams = {
      'customer': {
        'identificationType': documentType,
        'identificationNumber': this.bdbRsaProvider.encrypt(documentNumber)
      },
      'pin': this.bdbRsaProvider.encrypt(pin)
    };

    return this.bdbHttpClient.post<ModalRs>(
      'security/pin/add', bodyParams, ENV.API_URL, null,   new RequestEvents (BdbEventsConstants.security.authentication));
  }

  modify(documentType: string, documentNumber: string, pin: number, oldPin: number) {
    const bodyParams = {
      'customer': {
        'identificationType': documentType,
        'identificationNumber': this.bdbRsaProvider.encrypt(documentNumber)
      },
      'pin': this.bdbRsaProvider.encrypt(pin),
      'oldPin': this.bdbRsaProvider.encrypt(oldPin)
    };

    return this.bdbHttpClient.post<ModalRs>(
      'security/pin/update', bodyParams, ENV.API_URL, null,  new RequestEvents (BdbEventsConstants.security.authenticationUpdate));

  }

  recover(documentType: string, documentNumber: string, pin: string, otp: string) {
    const bodyParams = {
      'customer': {
        'identificationType': documentType,
        'identificationNumber': this.bdbRsaProvider.encrypt(documentNumber)
      },
      'pin': this.bdbRsaProvider.encrypt(pin),
      'otp': this.bdbRsaProvider.encrypt(otp)
    };

    return this.bdbHttpClient.post<ModalRs>(
      'security/virtual/pin/add', bodyParams, ENV.API_URL, null, new RequestEvents (BdbEventsConstants.security.pinadd) );

  }


  getDataSecure(documentType: string, documentNumber: string) {
    const bodyParams = {
      'identificationType': this.bdbRsaProvider.encrypt(documentType),
      'identificationNumber': this.bdbRsaProvider.encrypt(documentNumber)

    };

    return this.bdbHttpClient.post<any>(
      'products/analyze/tree', bodyParams, ENV.API_URL, null, new RequestEvents (BdbEventsConstants.security.analyzeTree));
  }

  getValidateProduct(documentType: string,
    documentNumber: string,
    productType: string,
    productNumber: string
  ) {
    const bodyParams = {
      'customer': {
        'identificationType': this.bdbRsaProvider.encrypt(documentType),
        'identificationNumber': this.bdbRsaProvider.encrypt(documentNumber)
      },
      'productType': this.bdbRsaProvider.encrypt(productType),
      'productNumber': this.bdbRsaProvider.encrypt(productNumber)
    };

    return this.bdbHttpClient.post<any>(
      'products/analyze/number', bodyParams, ENV.API_URL, null, new RequestEvents (BdbEventsConstants.security.analyzeNumber));
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InMemoryKeys } from '../../../../../providers/storage/in-memory.keys';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { Customer, NewAuthenticatorResponse, NewValPinRq } from '@app/apis/authenticator/models/authenticator.model';
import { DeviceRsa } from '../../../../../app/models/auth/secure-pass-rq';
import { BdbCookies } from '../../../../../providers/bdb-cookie/bdb-cookie';
import { BdbRsaProvider } from '../../../../../providers/bdb-rsa/bdb-rsa';
import { AuthenticatorApiService } from '@app/apis/authenticator/authenticator';
import { LoginData } from '../../../../../app/models/login-data';
import { FingerPrintService } from '@app/shared/utils/bdb-finger-print-service/finger-print.service';
import { switchMap } from 'rxjs/operators';
import {AuthFacade} from '@app/modules/authentication/store/facades/auth.facade';

declare var rsaFunc;

@Injectable()
export class AuthenticatorServiceApi {

  constructor(
    private authenticatorApiService: AuthenticatorApiService,
    private bdbStorageService: BdbStorageService,
    private bdbCookie: BdbCookies,
    private bdbRsaProvider: BdbRsaProvider,
    private authFacade: AuthFacade,
    private fingerPrintService: FingerPrintService
  ) {
  }

  public securePassword(loginData: LoginData): Observable<NewAuthenticatorResponse> {

    const newLogin: NewValPinRq = this.buildRequestLogin(loginData);

    return this.fingerPrintService.getFraudDetectorFingerPrint()
      .pipe(switchMap((fingerPrintData) => {
        newLogin.authenticationExtraInfo = {
          fraudDetectorFingerPrint: fingerPrintData
        };
        return this.authenticatorApiService.validateCredentials(newLogin);
      }));
  }

    public buildRequestLogin(loginData): NewValPinRq {
    this.bdbStorageService.setItemByKey(InMemoryKeys.ThKyIn, loginData.password);
      const deviceRsa = this.getDeviceTokenCookie();

      const costumer: Customer = {
        identificationType: loginData.identificationType,
        identificationNumber: loginData.identificationNumber,
        remoteAddress: '127.0.0.1',
        channel: 'PB'
      };

        return {
          customer: costumer,
          password: loginData.password,
          mobileToken: loginData.tokenMFA,
          recaptchaToken: loginData.tokenRecaptcha,
          deviceFingerprint: deviceRsa.devicePrint,
          tokenCookie: this.authFacade.getTokenCookie() || deviceRsa.deviceTokenCookie,
          numberCard: !!loginData.lastDigitDebitCard ? loginData.lastDigitDebitCard : null
        };
    }

  public getDeviceTokenCookie(): any {
    const deviceCookie = this.bdbCookie.getCookie(InMemoryKeys.UUID_THREAT);
    const deviceRsa = new DeviceRsa(
      rsaFunc(),
      deviceCookie,
    );
    return deviceRsa;
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { catchError, take } from 'rxjs/operators';
import { RequestEvents } from '../../../../app/models/analytics-event/request-event';
import { ENV } from '@app/env';
import {CustomError} from './models/error.model';
import {App} from 'ionic-angular';
import {BdbModalProvider} from '../../../../providers/bdb-modal/bdb-modal';


export enum ErrorMapperType {
  DuplicatedTransaction = 'DUPLICATED_TRANSACTION',
  Timeout = 'TIMEOUT',
  DataDoesNotExist = 'DATA_NOT_EXIST',
  Challenge = 'CHALLENGE',
  InvalidToken = 'Validacion de Token No Exitosa',
  RecaptchaRobot = 'RECAPTCHA_ROBOT', // 401
  TokenBlocked = 'TOKEN_VALIDATION_ATTEMPTS_EXCEEDED',
  UserBlockedUniversalKey = 'Clave segura bloqueada',
  UserBlockedDebitCardPin = 'The debitcard is blocked'
}

@Injectable()
export class HttpClientWrapperProvider {

  constructor(
    public http: HttpClient,
    public appCtrl: App
  ) {
  }

  /**
   * T: request Type
   * U: response: Type
   *
   * @param request
   * @param resource
   */
  public postToADLApi<T, U>(request: T, resource: string): Observable<U> {
    return this.post<U>(resource, request, ENV.API_GATEWAY_ADL_URL);
  }

  public post<T>(
    resource: string,
    body: any,
    url): Observable<T> {
    return this.http.post<T>(
      url + resource,
      body).pipe(
      catchError(err => {
        return this.handleError(err);
      }),
      take(1));
  }

  public postOptions<T>(resource: string, body: any,
                        url,
                        options?: any,
                        analyticsInfo?: RequestEvents) {
    return this.http.post<T>(
      url + resource,
      body,
      options
    ).pipe(
      take(1)
    );
  }


  private handleError(e) {
  const error: CustomError  = e;
  let err = Observable.throw(e);
  // TO DO remove this conditional when backend solves timeout error code
  if (e.status === 504 || (e.error && e.error.errorMessage && e.error.errorMessage.toLowerCase().match('timeout'))) {
   error.errorType = ErrorMapperType.Timeout;
    return Observable.throw(error);
  }
    switch (e.status) {
      case 401:
        err = this.handleAuthenticationError(error);
        if (!!err) {
          return err;
        }
        break;
      case 409:
        err = this.handleBusinessErrorCode(error);
        if (!!err) {
          return err;
        }
        break;
      default:
      err = this.handleTimeoutError(error);
        if (!!err) {
          return err;
        }
        return Observable.throw(e);
    }
    return Observable.throw(e);
  }

  private handleBusinessErrorCode(e: CustomError) {
    if (e.error.businessErrorCode && e.error.businessErrorCode.match('DUPLICATED_TRANSACTION')) {
      e.errorType = ErrorMapperType.DuplicatedTransaction;
    } else if (e.error.businessErrorCode && (e.error.backendErrorMessage.match('No existe informacion para los criterios seleccionados.')
    || e.error.backendErrorMessage.match('No existe informacion acorde a los criterios seleccionados'))) {
      e.errorType = ErrorMapperType.DataDoesNotExist;
    } else if (e.error.businessErrorCode && e.error.businessErrorCode.match('CHALLENGE')) {
      e.errorType = ErrorMapperType.Challenge;
    } else if (e.error.businessErrorCode && e.error.backendErrorMessage.match('Validacion de Token No Exitosa')) {
      e.errorType = ErrorMapperType.InvalidToken;
    } else if (e.error.businessErrorCode && e.error.businessErrorCode.match('TOKEN_VALIDATION_ATTEMPTS_EXCEEDED')) {
      e.errorType = ErrorMapperType.TokenBlocked;
    } else if (e.error.businessErrorCode && e.error.backendErrorMessage.match('Clave segura bloqueada')) {
      e.errorType = ErrorMapperType.UserBlockedUniversalKey;
    } else if (e.error.businessErrorCode && e.error.backendErrorMessage.match('The debitcard is blocked')) {
      e.errorType = ErrorMapperType.UserBlockedDebitCardPin;
    }
    return Observable.throw(e);
  }

  private handleTimeoutError(e: CustomError) {
    if (e.status === 504 || (e.error && e.error.errorMessage && e.error.errorMessage.toLowerCase().match('timeout'))) {
    e.errorType = ErrorMapperType.Timeout;
    }
    return Observable.throw(e);
  }

  private handleAuthenticationError(e: CustomError) {
    if (e.error && (!e.error.originComponent || !(e.error.originComponent.toLowerCase() === 'authentication'))) {
      this.appCtrl.getRootNav().push('ExpiredSessionPage');
    } else if (e.error == null) {
      this.appCtrl.getRootNav().push('ExpiredSessionPage');
    }
    return Observable.throw(e);
  }

}



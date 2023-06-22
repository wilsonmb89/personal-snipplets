import { Action } from '@ngrx/store';
import {LoginData} from '../../../../../app/models/login-data';
import {NewAuthenticatorResponse} from '@app/apis/authenticator/models/authenticator.model';
import {StepsLoginEnum} from '../../../../../app/models/bdb-generics/bdb-constants';
import {Loading} from 'ionic-angular';
import {BdbLoaderService} from '@app/shared/utils/bdb-loader-service/loader.service';

export const LOGIN = '[Auth/API] login';
export const INIT_LOGIN = '[Auth/API] Load login form';
export const LOGIN_SUCCESS = '[Auth/API] Get login success';
export const LOGIN_ERROR = '[Auth/API] Get login error';
export const LOGIN_TOKEN = '[Auth/API] Get login token';
export const LOGIN_TOKEN_BLOCKED = '[Auth/API] Get token blocked';
export const LOGOUT = '[Auth/API] LOGOUT';
export const LOGIN_SECURE_SITE_KEY = '[Auth/API] Get secure site key';
export const AUTH_SESSION_EXPIRED = '[Auth/API] Session expired';
export const AUTH_INIT_SESSION_TIMEOUT = '[Auth/API] Init session timeout';
export const NO_ACTION = '[Auth/API] NO ACTION';
export const RESET_STATE_ACTION = '[Auth/API] RESET_STATE_ACTION';

export class LoginAction implements Action {
  readonly type = LOGIN;
  constructor(public loginRq: LoginData) {}
}

export class InitLoginAction implements Action {
  readonly type = INIT_LOGIN;
}

export class NoAction implements Action {
  readonly type = NO_ACTION;
}

export class LoginSuccessAction implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public login: NewAuthenticatorResponse) {}
}

export class LoginSecureSiteKeyAction implements Action {
  readonly type = LOGIN_SECURE_SITE_KEY;

  constructor(public login: NewAuthenticatorResponse) {}
}

export class LoginErrorAction implements Action {
  readonly type = LOGIN_ERROR;

  constructor(
  public stepLogin: StepsLoginEnum,
    public error: any
  ) {
  }
}

export class LoginTokenAction implements Action {
  readonly type = LOGIN_TOKEN;

  constructor(
    public stepLogin: StepsLoginEnum,
    public isTokenError: boolean,
    public error: any,
    public loginData: LoginData,
    public tokenCookie: string
  ) {
  }
}

export class LogoutAction implements Action {
  readonly type = LOGOUT;
}

export class SessionExpiredAction implements Action {
  readonly type = AUTH_SESSION_EXPIRED;
}

export class InitSessionTimeoutAction implements Action {
  readonly type = AUTH_INIT_SESSION_TIMEOUT;
}

export class ResetStateAction implements Action {
  readonly type = RESET_STATE_ACTION;
}

export type AuthenticatorActions = LoginAction | LoginSuccessAction | LoginErrorAction |
 LoginTokenAction | LogoutAction | LoginSecureSiteKeyAction | NoAction | SessionExpiredAction | InitSessionTimeoutAction | ResetStateAction;

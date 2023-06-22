import { Action } from '@ngrx/store';
import { LastLoginRs } from 'new-app/core/services-apis/identity-validation/models/last-login.model';

export const USER_LAST_LOGIN = '[User/API] Get last login';
export const USER_LAST_LOGIN_SUCCESS = '[User/API] Get last login success';
export const USER_LAST_LOGIN_ERROR = '[User/API] Get last login error';

export class LastLoginAction implements Action {
  readonly type = USER_LAST_LOGIN;
}

export class LastLoginSuccessAction implements Action {
  readonly type = USER_LAST_LOGIN_SUCCESS;

  constructor(public lastLogin: LastLoginRs) {}
}

export class LastLoginErrorAction implements Action {
  readonly type = USER_LAST_LOGIN_ERROR;
}

export type UserLoginActions = LastLoginAction | LastLoginSuccessAction | LastLoginErrorAction;

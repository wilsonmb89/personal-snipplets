import { Action } from '@ngrx/store';

export class ActionLogoutTypes {
    static LOGOUT = '[App] logout';
}

export class LogoutState implements Action {
    readonly type = ActionLogoutTypes.LOGOUT;
}

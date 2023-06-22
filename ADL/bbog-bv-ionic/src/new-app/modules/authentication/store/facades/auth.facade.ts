import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import * as authActions from '../actions/authenticator.action';
import * as loaderActions from '@app/shared/store/loader/actions/loader.action';
import * as authSelector from '../selectors/auth.selector';
import {LoginData} from '../../../../../app/models/login-data';
import {AuthenticationState} from '@app/modules/authentication/store/states/auth.state';
import {StepsLoginEnum} from '../../../../../app/models/bdb-generics/bdb-constants';
import {take} from 'rxjs/operators';
import {NewAuthenticatorResponse} from '@app/apis/authenticator/models/authenticator.model';

@Injectable()
export class AuthFacade {
  stepLogin$: Observable<StepsLoginEnum> = this.store.select(authSelector.stepLoginSelector);
  isTokenError$: Observable<boolean> = this.store.select(authSelector.isTokenErrorSelector);
  loginData$: Observable<LoginData> = this.store.select(authSelector.loginDataSelector);

  constructor(private store: Store<AuthenticationState>) {
  }

  public doLogin(loginData: LoginData): void {
    this.store.dispatch(new authActions.LoginAction(loginData));
  }

  public doLogout(): void {
    this.store.dispatch(new authActions.LogoutAction());
  }

  public doReset(): void {
    this.store.dispatch(new authActions.ResetStateAction());
  }

  public initSessionTimeout(): void {
    this.store.dispatch(new authActions.InitSessionTimeoutAction());
  }

  public sessionExpired(): void {
    this.store.dispatch(new authActions.SessionExpiredAction());
  }

  public doInitLoginForm(): void {
    this.store.dispatch(new authActions.InitLoginAction());
  }

  public load(): void {
    this.store.dispatch(new loaderActions.EnableLoadingAction());
  }

  public hide(): void {
    this.store.dispatch(new loaderActions.DisableLoadingAction());
  }

  public getTokenCookie(): string {
    let tokenCookie = '';
    this.store.select(authSelector.tokenCookieSelector).pipe(take(1)).subscribe(value => tokenCookie = value);
    return tokenCookie;
  }

  public refreshMFAStep(): void {
    this.store.select(authSelector.authState).pipe(take(1)).subscribe(authState => {
        this.store.dispatch(new authActions.LoginTokenAction(StepsLoginEnum.TOKEN_MFA, authState.isTokenError,
          authState.error, authState.loginData, authState.tokenCookie));
      }
    );
  }

  public getAuthenticationResponse(): NewAuthenticatorResponse {
    let authResponse: NewAuthenticatorResponse;
    this.store.select(authSelector.authenticationResponseSelector).pipe(take(1)).subscribe(res => authResponse = res);
    return authResponse;
  }

  public getAuthenticationErrorResponse(): any {
    let error = null;
    this.store.select(authSelector.authErrorSelector).pipe(take(1)).subscribe(res => error = res);
    return error;
  }

}

import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action, Store} from '@ngrx/store';
import {catchError, concatMap, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {AuthenticatorServiceApi} from '@app/modules/authentication/services/auth/authenticator.service';
import {InMemoryKeys} from '../../../../../providers/storage/in-memory.keys';
import {BdbInMemoryProvider} from '../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorMapperType} from '../../../../core/http/http-client-wrapper/http-client-wrapper.service';
import * as authAction from '../actions/authenticator.action';
import {LoginAction} from '../actions/authenticator.action';
import {AuthenticationState} from '@app/modules/authentication/store/states/auth.state';
import {StepsLoginEnum} from '../../../../../app/models/bdb-generics/bdb-constants';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';
import {BdbLogoutService} from '@app/modules/authentication/services/logout/logout.service';
import {NewAuthenticatorResponse} from '@app/apis/authenticator/models/authenticator.model';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';

@Injectable()
export class AuthorizationEffects {


  @Effect()
  doAuthorizationEffect$: Observable<Action> = this.actions$
    .ofType(authAction.LOGIN)
    .pipe(
      concatMap((action: any) => of(action)),
      switchMap((action: LoginAction) => this.authenticatorServiceApi.securePassword(action.loginRq).pipe(
        map((res: NewAuthenticatorResponse) => {
          this.bdbInMemory.setItemByKey(InMemoryKeys.IdentificationType, res.identificationType);
          this.bdbInMemory.setItemByKey(InMemoryKeys.IdentificationNumber, res.identificationNumber);
          this.bdbInMemory.setItemByKey(InMemoryKeys.AccessToken, res.accessToken);
          this.bdbInMemory.setItemByKey(InMemoryKeys.HasToken, res.hasActiveToken);
          this.bdbInMemory.setItemByKey(InMemoryKeys.TokenVersion, res.tokenVersion);
          this.bdbInMemory.setItemByKey(InMemoryKeys.IdCryptAnalytic, (res.identificationType + res.identificationNumber));
          this.bdbInMemory.setItemByKey(InMemoryKeys.TokenBank, res.tokenBank);
          this.bdbInMemory.setItemByKey(InMemoryKeys.UUID, res.uuid);
          this.bdbMicrofrontendEventsService.saveStateInSessionStorage('AuthState', res);
          this.bdbMicrofrontendEventsService.sendLoginEventToParentWindow();

          return {
            type: !!res.secureSiteKey ? authAction.LOGIN_SECURE_SITE_KEY : authAction.LOGIN_SUCCESS,
            login: res
          };
        })
        ,
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409 && !!error.error) {
            if (error.error.businessErrorCode === ErrorMapperType.Challenge) {

              return of({
                type: authAction.LOGIN_TOKEN,
                stepLogin: StepsLoginEnum.TOKEN_MFA,
                isTokenError: false,
                error: error,
                tokenCookie: error.error.customDetails.rsaRetryCorrelationId
              });
            } else if (error.error.backendErrorMessage === ErrorMapperType.InvalidToken) {
              this.bdbInMemory.clearItem(InMemoryKeys.ThKyIn);
              return of({
                type: authAction.LOGIN_TOKEN,
                stepLogin: StepsLoginEnum.INVALID_TOKEN_MFA,
                isTokenError: true,
                error: error,
                tokenCookie: error.error.customDetails.rsaRetryCorrelationId
              });
            } else if (error.error.businessErrorCode === ErrorMapperType.TokenBlocked) {
              return of({
                type: authAction.LOGIN_TOKEN,
                stepLogin: StepsLoginEnum.TOKEN_LOCKED,
                isTokenError: false,
                error: error
              });

            } else if (error.error.backendErrorMessage === ErrorMapperType.UserBlockedUniversalKey ||
            error.error.backendErrorMessage === ErrorMapperType.UserBlockedDebitCardPin ) {
              return of({
                type: authAction.LOGIN_ERROR,
                stepLogin: StepsLoginEnum.USER_BLOCKED,
                error: error
              });
            } else {
              return of({
                type: authAction.LOGIN_ERROR,
                stepLogin: StepsLoginEnum.LOGIN_ERROR_401,
                error: error
              });
            }
          } else if (error.status === 401) {
            return of({
              type: authAction.LOGIN_ERROR,
               stepLogin: StepsLoginEnum.LOGIN_ERROR_401,
              error: error
            });
          } else {
            return of({
              type: authAction.LOGIN_ERROR,
               stepLogin: StepsLoginEnum.LOGIN_ERROR,
              error: error
            });
          }
        })
      ))


    );


  @Effect()
  doShowLoginFormEffect$: Observable<Action> = this.actions$
    .ofType(authAction.INIT_LOGIN)
    .pipe(
      concatMap((action: any) => of(action)),
      switchMap((action: LoginAction) => {

        const isLoginFromFrame = this.bdbInMemory.getItemByKey(InMemoryKeys.IsLoginFromFrame);
        const dataDebitCardLogin = this.bdbInMemory.getItemByKey(InMemoryKeys.DataPbLandingLogin);
        let actionReturn;
        if (isLoginFromFrame === 1 && !!dataDebitCardLogin) {
          this.bdbInMemory.clearItem(InMemoryKeys.DataPbLandingLogin);
          actionReturn = of({
            type: authAction.LOGIN_TOKEN,
            stepLogin: StepsLoginEnum.TOKEN_MFA,
            loginData: dataDebitCardLogin,
          });
        } else {
          this.bdbInMemory.clearAll();
          this.userFacade.getPublicKey();
          actionReturn = of({
            type: authAction.RESET_STATE_ACTION,
          });
        }
        this.bdbInMemory.clearItem(InMemoryKeys.TuPlusData);
        this.bdbInMemory.setItemByKey(InMemoryKeys.IsLoginFromFrame, null);
        return actionReturn;
      }));

    @Effect({dispatch: false})
  initSessionTimeoutEffect$: Observable<Action> = this.actions$
    .ofType(authAction.AUTH_INIT_SESSION_TIMEOUT)
    .pipe(
      tap((_) => this.logoutService.initSessionTimeout())
    );

  @Effect({dispatch: false})
  logoutEffect$: Observable<Action> = this.actions$
   .ofType(authAction.LOGOUT)
   .pipe(
     tap((_) => this.logoutService.logout())
   );

   @Effect({dispatch: false})
   sessionExpiredEffect$: Observable<Action> = this.actions$
    .ofType(authAction.AUTH_SESSION_EXPIRED)
    .pipe(
      tap((_) => this.logoutService.sessionExpired())
    );

  constructor(
    private authenticatorServiceApi: AuthenticatorServiceApi,
    private store: Store<AuthenticationState>,
    private actions$: Actions,
    private bdbInMemory: BdbInMemoryProvider,
    private userFacade: UserFacade,
    private logoutService: BdbLogoutService,
    private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService
  ) { }
}

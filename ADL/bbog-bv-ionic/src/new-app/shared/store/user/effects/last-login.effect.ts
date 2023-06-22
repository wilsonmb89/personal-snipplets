import * as loginActions from '../actions/login.action';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { ValidationApiService } from '../../../../core/services-apis/identity-validation/validation-api.service';
import { catchError, first, map, switchMap } from 'rxjs/operators';
import { UserState } from '../states/user.state';
import { lastLoginSelector } from '../selectors/user.selector';

@Injectable()
export class LastLoginEffects {
  @Effect()
  lastLoginEffect$: Observable<Action> = this.actions$
    .ofType(loginActions.USER_LAST_LOGIN)
    .pipe(
      switchMap((_) => this.store.select(lastLoginSelector).pipe(first())),
      switchMap((lastLogin) =>
        lastLogin.currentIp !== '127.0.0.1'
          ? of({ type: loginActions.USER_LAST_LOGIN_SUCCESS, lastLogin })
          : this.getLastLogin()
      )
    );

  constructor(
    private validationApi: ValidationApiService,
    private store: Store<UserState>,
    private actions$: Actions
  ) {}

  private getLastLogin(): Observable<Action> {
    return this.validationApi.getLastLogin().pipe(
      map((lastLogin) => ({
        type: loginActions.USER_LAST_LOGIN_SUCCESS,
        lastLogin,
      })),
      catchError((error) => of({ type: loginActions.USER_LAST_LOGIN_ERROR }))
    );
  }
}

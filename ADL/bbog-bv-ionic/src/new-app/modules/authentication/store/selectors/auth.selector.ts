import { createFeatureSelector, createSelector } from '@ngrx/store';
import {AuthenticationState} from '@app/modules/authentication/store/states/auth.state';


export const authState = createFeatureSelector<AuthenticationState>('authState');

export const stepLoginSelector = createSelector(
  authState,
  (state: AuthenticationState) => state.stepLogin
);

export const isTokenErrorSelector = createSelector(
  authState,
  (state: AuthenticationState) => state.isTokenError
);

export const loginDataSelector = createSelector(
  authState,
  (state: AuthenticationState) => state.loginData
);

export const tokenCookieSelector = createSelector(
  authState,
  (state: AuthenticationState) => state.tokenCookie
);

export const authenticationResponseSelector = createSelector(
  authState,
  (state: AuthenticationState) => state.authenticatorRs
);

export const authStateSelector = createSelector(
  authState,
  (state: AuthenticationState) => state
);

export const authErrorSelector = createSelector(
  authState,
  (state: AuthenticationState) => state.error
);

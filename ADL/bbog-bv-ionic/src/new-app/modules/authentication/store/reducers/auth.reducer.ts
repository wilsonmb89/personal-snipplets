import {initialState, AuthenticationState} from '../states/auth.state';
import * as authActions from '../actions/authenticator.action';
import {StepsLoginEnum} from '../../../../../app/models/bdb-generics/bdb-constants';

type AuthActions =
  | authActions.AuthenticatorActions;

export function authReducer(
  state = initialState,
  action: AuthActions
): AuthenticationState {
  switch (action.type) {
    case authActions.LOGIN:
      return {
        ...state,
        authenticatorRs: {
          ...state.authenticatorRs,
        }
      };
    case authActions.LOGIN_SUCCESS:
      return {
        ...state,
        authenticatorRs: action.login,
        completed: true,
        error: null,
        stepLogin: StepsLoginEnum.LOGIN_SUCCESS,
      };
    case authActions.LOGIN_ERROR:
      return {
        ...state,
        authenticatorRs: null,
        completed: false,
        error: action.error,
        stepLogin: action.stepLogin
      };
    case authActions.LOGIN_TOKEN:
      return {
        ...state,
        authenticatorRs: null,
        completed: false,
        error: action.error,
        stepLogin: action.stepLogin,
        tokenCookie: !!action.tokenCookie ? action.tokenCookie : state.tokenCookie,
        isTokenError: action.isTokenError,
        loginData: action.loginData
      };
     case authActions.RESET_STATE_ACTION:
     case authActions.LOGOUT:
      return {
        ...state,
        authenticatorRs: null,
        completed: false,
        error: null,
        stepLogin: StepsLoginEnum.SIGN_IN,
        tokenCookie: null,
        isTokenError: false
      };
     case authActions.LOGIN_SECURE_SITE_KEY:
      return {
        ...state,
        authenticatorRs: action.login,
        completed: true,
        error: null,
        stepLogin: StepsLoginEnum.NUMBER_SAFE_SITE,
      };
    default:
      return state;
  }
}

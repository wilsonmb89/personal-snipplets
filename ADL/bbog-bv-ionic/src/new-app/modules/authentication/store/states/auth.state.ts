
import {NewAuthenticatorResponse} from '@app/apis/authenticator/models/authenticator.model';
import {HttpErrorResponse} from '@angular/common/http';
import {StepsLoginEnum} from '../../../../../app/models/bdb-generics/bdb-constants';
import {LoginData} from '../../../../../app/models/login-data';

export interface AuthenticationState {
  authenticatorRs: NewAuthenticatorResponse;
  publicKey: string;
  completed: boolean;
  error: HttpErrorResponse;
  stepLogin: StepsLoginEnum;
  tokenCookie?: string;
  isTokenError?: boolean;
  loginData?: LoginData;
}


export const initialState: AuthenticationState = {
  authenticatorRs: null,
  publicKey: null,
  completed: false,
  error: null,
  stepLogin: StepsLoginEnum.SIGN_IN,
  tokenCookie: null,
  isTokenError: false,
  loginData: null
};

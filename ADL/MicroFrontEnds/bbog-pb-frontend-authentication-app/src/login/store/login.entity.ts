import { LoginCredentials, LoginOptions } from '@avaldigitallabs/bbog-pb-lib-frontend-commons/build/auth/login.model';

export interface LoginRequest {
  credentials: LoginCredentials;
  options: LoginOptions;
}

export const initialState: LoginRequest = {
  credentials: {
    identificationNumber: null,
    identificationType: null,
    password: null,
    numberCard: null
  },
  options: {
    tokenCookie: null,
    mobileToken: null,
    recaptchaToken: null
  }
};

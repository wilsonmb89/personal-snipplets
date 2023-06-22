export interface NewValPinRq {

  customer: Customer;
  password: string;
  mobileToken?: string;
  recaptchaToken?: string;
  deviceFingerprint?: string;
  tokenCookie?: string;
  numberCard?: string;
  authenticationExtraInfo?: AuthenticationExtraData;
}

export interface Customer {
  identificationType: string;
  identificationNumber: string;
  remoteAddress: string;
  channel: string;
}

export interface AuthenticationExtraData {
  fraudDetectorFingerPrint?: string;
}

export interface NewAuthenticatorResponse {
    accessToken: string;
    tokenBank: string;
    fullName: string;
    identificationNumber: string;
    identificationType: string;
    telephone: string;
    email: string;
    sessionId: string;
    secureSiteKey: string;
    hasActiveToken: boolean;
    cdtOwner: boolean;
    tokenCookie: string;
    tokenVersion: string;
    uuid?: string;
}
export interface NewLoginResponse {
  accessToken: string;
  tokenBank: string;
  fullName: string;
  identificationNumber: string;
  identificationType: string;
  telephone: string;
  email: string;
  sessionId: string;
  hasActiveToken: boolean;
  actionCode: string;
  tokenVersion: string;
  cdtOwner: boolean;
}


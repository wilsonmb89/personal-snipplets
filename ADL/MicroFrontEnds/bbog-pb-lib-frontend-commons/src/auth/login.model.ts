export interface LoginConfig {
  host: string;
  encryptBody: boolean;
}

export interface LoginCredentials {
  identificationNumber: string;
  identificationType: string;
  password: string;
  numberCard?: string;
  authenticationExtraInfo?: AuthenticationExtraData;
}

export interface LoginOptions {
  tokenCookie?: string;
  mobileToken?: string;
  recaptchaToken?: string;
}

export interface LoginRequest {
  customer: {
    identificationType: string;
    identificationNumber: string;
    channel: string;
    remoteAddress: string;
  };
  password: string;
  mobileToken: string | null;
  recaptchaToken: string | null;
  deviceFingerprint: string;
  tokenCookie: string | null;
  numberCard: string | null;
  authenticationExtraInfo?: AuthenticationExtraData | null;
}

export interface AuthenticationExtraData {
  fraudDetectorFingerPrint?: string;
}
export interface LoginResponse {
  accessToken: string;
  tokenBank: string;
  fullName: string;
  identificationNumber: string;
  identificationType: string;
  telephone: string;
  email: string;
  sessionId: string;
  hasActiveToken: boolean;
  tokenVersion: string;
  cdtOwner: string;
  traceability: string;
}

export type LoginSuccess = LoginResponse;

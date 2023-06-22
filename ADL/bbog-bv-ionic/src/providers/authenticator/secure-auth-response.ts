export class SecureAuthResponse {
  isValid: boolean;
  isBlocked: boolean;
  accessToken: string;
  identificationType: string;
  identificationNumber: string;
}

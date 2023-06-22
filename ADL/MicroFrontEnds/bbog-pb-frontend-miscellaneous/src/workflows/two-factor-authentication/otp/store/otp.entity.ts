export interface SimValidationRs {
  phoneNumber: string;
  provider: string;
  isSecure: boolean;
  isValid: boolean;
}

interface OTPState {
  simData: SimValidationRs;
  isOTPValid: boolean;
  hasOTPBeenSent: boolean;
  hasCallOTPBeenSent: boolean;
  attemps: number;
}

export const initialState: OTPState = {
  simData: null,
  isOTPValid: null,
  attemps: 3,
  hasOTPBeenSent: false,
  hasCallOTPBeenSent: false
};

export interface GetOtpReq {
  refType: '01';
  name: string;
  operator?: string;
  operationType?: string;
}

export interface GetOtpRes {
  message: string;
}

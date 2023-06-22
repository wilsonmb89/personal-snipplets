export interface TokenInfoRs {
  id: string;
  type: 'Mobile';
  status: string;
}

export interface ValidateOtpTokenRq {
  otpValue: string;
  tokenType: 'MOBILE' | 'SMS';
  operator?: string;
  operationType?: string;
  refType?: string;
}

export interface ValidateOtpTokenRs {
  xfad: string;
}

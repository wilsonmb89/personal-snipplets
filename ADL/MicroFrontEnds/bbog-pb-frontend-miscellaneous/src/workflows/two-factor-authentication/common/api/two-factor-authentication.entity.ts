export interface ValidateOtpTokenRq {
  otpValue: string;
  tokenType: 'MOBILE' | 'SMS';
  operator?: string;
  operationType?: string;
  refType?: '01';
}

export interface ValidateOtpTokenRs {
  approvalId: string;
}

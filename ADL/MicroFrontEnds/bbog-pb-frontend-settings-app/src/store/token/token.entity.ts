export enum TokenStatus {
  basic = 1,
  success,
  wrong,
  fail,
  error,
  need
}

export interface TokenInfo {
  id: string;
  type: 'Mobile';
  status: string;
}

interface TokenState {
  tokenInfo: TokenInfo | null;
  attemps: number;
  status: TokenStatus;
  showModal: boolean;
}

export const initialState: TokenState = {
  tokenInfo: null,
  attemps: 3,
  status: 1,
  showModal: false
};

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
  approvalId: string;
}

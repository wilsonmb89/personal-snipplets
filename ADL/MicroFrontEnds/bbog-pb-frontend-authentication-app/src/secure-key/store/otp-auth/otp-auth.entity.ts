import { Customer } from '../customer/customer.entity';

export interface GetOTPRq {
  customer: Customer;
  refType: string;
  name: string;
  operationType: string;
}

export interface OTPAuthRq {
  customer: Customer;
  refType: string;
  otpValue: string;
}

export interface OTPAuthState {
  accessToken: string;
  sessionId: string;
  tokenVersion: string;
  cdtOwner: boolean;
}

export const initialState: OTPAuthState = {
  accessToken: '',
  sessionId: '',
  tokenVersion: '',
  cdtOwner: false
};

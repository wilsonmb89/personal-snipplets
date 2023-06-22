export interface AllowedOTPServicesV2 {
  [key: string]: OTPServiceRules;
}

export interface OTPServiceRules {
  otpByCall: boolean;
  otpBySms: boolean;
}

export interface UserSettingsState {
  customer: { [key: string]: string };
  settings: { [key: string]: unknown };
  toggle: {
    [key: string]: unknown;
    allowedOTPServicesV2: AllowedOTPServicesV2;
  };
}

export const initialState: UserSettingsState = {
  customer: null,
  settings: null,
  toggle: {
    allowedOTPServicesV2: {}
  }
};

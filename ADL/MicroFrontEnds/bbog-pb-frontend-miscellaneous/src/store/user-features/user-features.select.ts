import { RootState } from '..';
import { AllowedOTPServicesV2, OTPServiceRules, UserSettingsState } from './user-features.entity';

export const userSettingsState = (state: RootState): UserSettingsState => state.userSettingsState;

export const allowedOTPServicesV2Selector = (state: RootState): AllowedOTPServicesV2 => {
  return userSettingsState(state).toggle.allowedOTPServicesV2;
};

export const getAllowedOTPByService =
  (flow: string) =>
  (state: RootState): OTPServiceRules => {
    const allowedService = allowedOTPServicesV2Selector(state)[flow];
    return allowedService || { otpByCall: null, otpBySms: null };
  };

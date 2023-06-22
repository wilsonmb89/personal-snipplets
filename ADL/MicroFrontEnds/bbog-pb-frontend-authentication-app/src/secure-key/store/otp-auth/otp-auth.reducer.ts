import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, OTPAuthState } from './otp-auth.entity';

export const otpAuthState = createSlice({
  name: 'OTPAuthState',
  initialState,
  reducers: {
    setOtpResponse(state, { payload }: PayloadAction<OTPAuthState>) {
      return {
        ...state,
        accessToken: payload.accessToken,
        cdtOwner: payload.cdtOwner,
        sessionId: payload.sessionId,
        tokenVersion: payload.tokenVersion
      };
    },
    reset() {
      return { ...initialState };
    }
  }
});

export const otpActions = otpAuthState.actions;

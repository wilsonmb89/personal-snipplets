import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, SimValidationRs } from './otp.entity';

export const createOTPState = createSlice({
  name: 'OTPState',
  initialState,
  reducers: {
    simValidationSuccess(state, { payload }: PayloadAction<SimValidationRs>) {
      return {
        ...state,
        simData: { ...payload }
      };
    },
    otpValidationSuccess(state) {
      return {
        ...state,
        isOTPValid: true
      };
    },
    getOTPSuccess(state) {
      return {
        ...state,
        hasOTPBeenSent: true
      };
    },
    getCallOTPSuccess(state) {
      return {
        ...state,
        hasCallOTPBeenSent: true
      };
    },
    otpValidationError(state) {
      return {
        ...state,
        attemps: state.attemps - 1
      };
    },
    reset() {
      return { ...initialState };
    }
  }
});

export const otpActions = createOTPState.actions;

import { RootState } from '@store/index';
import { initialState } from './otp.entity';

export const isSimValidSelector = (state: RootState): boolean => state.otpState?.simData?.isValid;

export const isOTPValidSelector = (state: RootState): boolean => state.otpState.isOTPValid;

export const hasOTPBeenSentSelector = (state: RootState): boolean => state.otpState.hasOTPBeenSent;

export const hasCallOTPBeenSentSelector = (state: RootState): boolean => state.otpState.hasCallOTPBeenSent;

export const hasAttemptsLeftSelector = (state: RootState): boolean => state.otpState.attemps !== 0;

export const otpAttemptErrorSelector = (state: RootState): string => {
  if (state.otpState.attemps === initialState.attemps || state.otpState.attemps === 0) {
    return null;
  }
  return state.otpState.attemps === 1
    ? `Código incorrecto, te queda 1 intento`
    : `Código incorrecto, te quedan ${state.otpState.attemps} intentos`;
};

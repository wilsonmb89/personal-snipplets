import { RootState } from '@store/index';
import { initialState } from './token.entity';

export const isTokenValidSelector = (state: RootState): boolean => state.tokenState.isTokenValid;

export const hasAttemptsLeftSelector = (state: RootState): boolean => state.tokenState.attemps !== 0;

export const tokenAttemptErrorSelector = (state: RootState): string => {
  if (state.tokenState.attemps === initialState.attemps || state.tokenState.attemps === 0) {
    return null;
  }
  return state.tokenState.attemps === 1
    ? `Código incorrecto, te queda 1 intento`
    : `Código incorrecto, te quedan ${state.tokenState.attemps} intentos`;
};

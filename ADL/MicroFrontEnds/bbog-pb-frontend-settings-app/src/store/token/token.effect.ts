import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '..';
import { loadingHandler } from '../loader/loader.store';
import { fetchTokenInfo, fetchValidateToken } from './token.api';
import { ValidateOtpTokenRq } from './token.entity';
import { tokenActions } from './token.store';

export const fetchTokenData = (): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch): Promise<void> => {
    try {
      const tokenInfo = await fetchTokenInfo();
      dispatch(tokenActions.fetchTokenInfo(tokenInfo));
      if (tokenInfo.status === 'Activo') {
        dispatch(tokenActions.showTokenModal());
      } else {
        dispatch(tokenActions.showNeedTokenModal());
      }
    } catch (error) {
      dispatch(tokenActions.showNeedTokenModal());
      console.log(error);
    }
  };
  return loadingHandler.bind(null, fetch);
};

export const fetchTokenValidation = (attemptCode: string): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    try {
      const validateTokenRq: ValidateOtpTokenRq = {
        otpValue: attemptCode,
        tokenType: 'MOBILE'
      };
      await fetchValidateToken(validateTokenRq);
      dispatch(tokenActions.fetchTokenAttemptSuccess());
    } catch (error) {
      const currentAttempts = state.tokenState.attemps;
      if (currentAttempts > 1) {
        dispatch(tokenActions.fetchTokenAttempWrong());
      } else {
        dispatch(tokenActions.fetchTokenAttemptFail());
      }
      throw new Error(error);
    }
  };
  return loadingHandler.bind(null, fetch);
};

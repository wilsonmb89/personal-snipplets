import { Dispatch } from '@reduxjs/toolkit';
import { loadingHandler } from '@store/loader/loader.store';
import { AxiosError } from 'axios';
import { fetchValidateToken } from '../../common/api/two-factor-authentication.api';
import { ValidateOtpTokenRq } from '../../common/api/two-factor-authentication.entity';
import { tokenActions } from './token.reducer';

export const fetchTokenValidation = (attemptCode: string): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch): Promise<void> => {
    try {
      const validateTokenRq: ValidateOtpTokenRq = {
        otpValue: attemptCode,
        tokenType: 'MOBILE'
      };
      await fetchValidateToken(validateTokenRq);
      dispatch(tokenActions.tokenValidationSuccess());
    } catch (error) {
      const errorCode = errorStatusHelper(error);
      if (errorCode === 409) {
        dispatch(tokenActions.tokenValidationError());
      } else {
        throw new Error(error);
      }
    }
  };
  return loadingHandler.bind(null, fetch);
};

const errorStatusHelper = (error: AxiosError & { status: number }): number => {
  if (error.response) {
    return error.response.status;
  } else if (error.status) {
    return error.status;
  }
  return 500;
};

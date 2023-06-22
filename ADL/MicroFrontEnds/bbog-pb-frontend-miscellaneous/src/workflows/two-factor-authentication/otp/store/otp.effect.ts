import { Dispatch } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { RootState } from '@store/index';
import { showToast } from '@store/toast/toast.store';
import { loadingHandler } from '@store/loader/loader.store';
import { fetchValidateToken } from '../../common/api/two-factor-authentication.api';
import { ValidateOtpTokenRq } from '../../common/api/two-factor-authentication.entity';
import { fetchGetOTP as fetchGetOTPApi } from './otp.api';
import { fetchSimValidationApi } from './otp.api';
import { GetOtpReq } from './otp.entity';
import { otpActions } from './otp.reducer';

export const fetchSimValidation = (): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch): Promise<void> => {
    const simValidationRs = await fetchSimValidationApi();
    dispatch(otpActions.simValidationSuccess(simValidationRs));
  };
  return loadingHandler.bind(null, fetch);
};

export const fetchGetOTP = (): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    const getOTPRq: GetOtpReq = {
      refType: '01',
      name: 'LOGIN',
      operator: state.otpState.simData.provider
    };
    await fetchGetOTPApi(getOTPRq);
    dispatch(otpActions.getOTPSuccess());
    dispatch(showToast({ title: null, type: 'success', message: 'Código SMS enviado' }));
  };
  return loadingHandler.bind(null, fetch);
};

export const fetchGetOTPFromCall = (): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch): Promise<void> => {
    const getOTPRq: GetOtpReq = {
      refType: '01',
      name: 'CALL',
      operationType: 'REG'
    };
    await fetchGetOTPApi(getOTPRq);
    dispatch(otpActions.getCallOTPSuccess());
    dispatch(showToast({ title: null, type: 'success', message: 'Código de seguridad enviado por llamada' }));
  };
  return loadingHandler.bind(null, fetch);
};

export const fetchOTPValidation = (attemptCode: string): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    try {
      const validateTokenRq: ValidateOtpTokenRq = {
        otpValue: attemptCode,
        tokenType: 'SMS',
        refType: '01',
        operator: state.otpState.simData.provider
      };
      await fetchValidateToken(validateTokenRq);
      dispatch(otpActions.otpValidationSuccess());
    } catch (error) {
      const errorCode = errorStatusHelper(error);
      if (errorCode === 409) {
        dispatch(otpActions.otpValidationError());
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

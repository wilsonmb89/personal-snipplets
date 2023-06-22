import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/constants';
import { TokenInfo, ValidateOtpTokenRq, ValidateOtpTokenRs } from './token.entity';

export const fetchTokenInfo = (): Promise<TokenInfo> => {
  return axiosADLInstance
    .post<Record<string, never>, AxiosResponse<TokenInfo>>('/validation/token/info', {})
    .then(response => response.data);
};

export const fetchValidateToken = (validateOtpTokenRq: ValidateOtpTokenRq): Promise<ValidateOtpTokenRs> => {
  return axiosADLInstance
    .post<ValidateOtpTokenRq, AxiosResponse<ValidateOtpTokenRs>>('validation/validate-otp', validateOtpTokenRq)
    .then(response => response.data);
};

import { AxiosResponse } from 'axios';
import { ValidateOtpTokenRq, ValidateOtpTokenRs } from './two-factor-authentication.entity';
import { axiosADLInstance } from '@utils/constants';

export const fetchValidateToken = (validateOtpTokenRq: ValidateOtpTokenRq): Promise<ValidateOtpTokenRs> => {
  return axiosADLInstance
    .post<ValidateOtpTokenRq, AxiosResponse<ValidateOtpTokenRs>>('validation/validate-otp', validateOtpTokenRq)
    .then(response => response.data);
};

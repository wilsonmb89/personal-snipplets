import { AxiosResponse } from 'axios';
import { GetOtpReq, GetOtpRes, SimValidationRs } from './otp.entity';
import { axiosADLInstance } from '@utils/constants';

export const fetchGetOTP = (validateOtpTokenRq: GetOtpReq): Promise<GetOtpRes> => {
  return axiosADLInstance
    .post<GetOtpReq, AxiosResponse<GetOtpRes>>('validation/get-otp', validateOtpTokenRq)
    .then(response => response.data);
};

export const fetchSimValidationApi = (): Promise<SimValidationRs> => {
  return axiosADLInstance
    .post<Record<string, never>, AxiosResponse<SimValidationRs>>('validation/validate-sim', {})
    .then(response => response.data);
};

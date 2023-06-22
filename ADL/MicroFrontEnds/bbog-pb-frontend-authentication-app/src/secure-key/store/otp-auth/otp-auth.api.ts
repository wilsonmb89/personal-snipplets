import { GenericResponse } from '@constants/generic-response';
import { axiosADLInstance } from '@utils/axios-instance';
import { AxiosResponse } from 'axios';
import { GetOTPRq, OTPAuthRq, OTPAuthState } from './otp-auth.entity';

export const getOTPApi = (request: GetOTPRq): Promise<GenericResponse> => {
  return axiosADLInstance
    .post<GetOTPRq, AxiosResponse<GenericResponse>>('/register-unchecked/get-otp', request)
    .then(response => response.data);
};

export const otpAuthApi = (request: OTPAuthRq): Promise<OTPAuthState> => {
  return axiosADLInstance
    .post<OTPAuthRq, AxiosResponse<OTPAuthState>>('/authentication/v3/otp-auth', request)
    .then(response => response.data);
};

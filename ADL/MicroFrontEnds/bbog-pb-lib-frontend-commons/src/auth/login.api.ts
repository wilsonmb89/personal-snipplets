import { AxiosResponse, AxiosInstance } from 'axios';
import { LoginRequest, LoginResponse } from './login.model';

export const loginApi = (request: LoginRequest, axiosInstance: AxiosInstance): Promise<LoginResponse> =>
  axiosInstance
    .post<LoginRequest, AxiosResponse<LoginResponse>>(`authentication/web-auth`, request)
    .then(response => response.data);

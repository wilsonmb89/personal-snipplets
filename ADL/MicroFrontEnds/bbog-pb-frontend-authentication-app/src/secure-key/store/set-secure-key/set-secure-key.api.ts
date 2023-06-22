import { GenericResponse } from '@constants/generic-response';
import { axiosADLInstance } from '@utils/axios-instance';
import { AxiosResponse } from 'axios';

interface SetSecureKeyRq {
  secureKey: string;
  deviceUid?: string;
}
const SET_KEY_API = '/register-checked/v2/set-secure-key';
const RESET_KEY_API = '/register-checked/v2/reset-secure-key';

export const setSecureKeyApi = async (request: SetSecureKeyRq, isRegister: boolean): Promise<GenericResponse> => {
  const apiUrl = isRegister ? SET_KEY_API : RESET_KEY_API;
  return axiosADLInstance
    .post<SetSecureKeyRq, AxiosResponse<GenericResponse>>(apiUrl, request)
    .then(response => response.data);
};

import { GenericResponse } from '@constants/generic-response';
import { axiosADLInstance } from '@utils/axios-instance';
import { AxiosResponse } from 'axios';
import { ValidatePinRq, ValidationProductsState } from './validation-products.entity';

export const validationProductsApi = (): Promise<ValidationProductsState> => {
  return axiosADLInstance
    .post<Record<string, never>, AxiosResponse<ValidationProductsState>>(
      '/register-checked/get-validation-products',
      {}
    )
    .then(response => response.data);
};

export const validatePinApi = (request: ValidatePinRq): Promise<GenericResponse> => {
  return axiosADLInstance
    .post<ValidatePinRq, AxiosResponse<GenericResponse>>('/register-checked/validate-pin', request)
    .then(response => response.data);
};

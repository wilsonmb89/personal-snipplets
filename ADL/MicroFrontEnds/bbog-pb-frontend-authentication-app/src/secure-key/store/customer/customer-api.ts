import { axiosADLInstance } from '@utils/axios-instance';
import { AxiosResponse } from 'axios';
import { Customer, RegisterBasicData } from './customer.entity';

export const registerBasicDataApi = (customer: Customer): Promise<RegisterBasicData> => {
  return axiosADLInstance
    .post<Customer, AxiosResponse<RegisterBasicData>>('/register-unchecked/get-register-basic-data', { customer })
    .then(response => response.data);
};

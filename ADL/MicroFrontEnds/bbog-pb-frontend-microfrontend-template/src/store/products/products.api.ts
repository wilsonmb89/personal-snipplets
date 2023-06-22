import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/constants';
import { Product } from './products.entity';

export const fetchProductsApi = (): Promise<Product[]> => {
  return axiosADLInstance
    .post<Record<string, never>, AxiosResponse<{ accountList: Product[] }>>('products/get-all', {})
    .then(response => response.data.accountList);
};

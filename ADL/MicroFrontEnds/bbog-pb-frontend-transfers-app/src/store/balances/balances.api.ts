import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/constants';
import { BalancesResponse, BalanceRequest } from './balances.entity';

export const balanceApi = (request: BalanceRequest): Promise<BalancesResponse[]> => {
  return axiosADLInstance
    .post<BalanceRequest, AxiosResponse<{ productBalanceInfoList: BalancesResponse[] }>>(
      'products-detail/balances/batch-inquiry',
      request
    )
    .then(response => response.data.productBalanceInfoList);
};

import { axiosADLInstance } from '@utils/constants';
import { AxiosResponse } from 'axios';
import { TransferRequest, TransferResponse } from './account-transfer.entity';

export const transferToAccountApi = (transferRq: TransferRequest): Promise<TransferResponse> => {
  return axiosADLInstance
    .post<TransferRequest, AxiosResponse<TransferResponse>>(`transfer-account/do-transfer`, transferRq)
    .then(response => response.data);
};

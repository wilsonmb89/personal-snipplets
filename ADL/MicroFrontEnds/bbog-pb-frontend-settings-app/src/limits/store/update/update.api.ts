import { axiosADLInstance } from '@utils/constants';
import { AxiosResponse } from 'axios';
import { TransactionSuccessResponse, UpdateAccountLimitRequest, UpdateLimitState } from './update.entity';

export const updateLimitApi = ({ acctId, acctType, limit }: UpdateLimitState): Promise<TransactionSuccessResponse> => {
  const request = { acctId, acctType, limits: [limit] };
  return axiosADLInstance
    .post<UpdateLimitState, AxiosResponse<TransactionSuccessResponse>>('customer-security/edit-limits', request)
    .then(response => response.data);
};

export const updateAccountLimitApi = ({
  acctId,
  acctType,
  limit
}: UpdateAccountLimitRequest): Promise<TransactionSuccessResponse> => {
  const request = { acctId, acctType, limits: [limit] };
  return axiosADLInstance
    .post<UpdateAccountLimitRequest, AxiosResponse<TransactionSuccessResponse>>(
      'customer-security/edit-limits-nat-acc',
      request
    )
    .then(response => response.data);
};

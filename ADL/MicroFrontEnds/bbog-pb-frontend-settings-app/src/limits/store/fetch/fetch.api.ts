import { axiosADLInstance } from '@utils/constants';
import { AccountLimit } from '../../models/account-limit.model';
import { Account } from '../../models/account.model';
import { Limit } from '../../models/limit.model';
import { AxiosResponse } from 'axios';

export const fetchLimitsApi = (request: Account): Promise<Limit[]> => {
  return axiosADLInstance
    .post<Account, AxiosResponse<{ bankLimit: Limit[] }>>('/customer-security/get-limits', request)
    .then(response => response.data.bankLimit);
};

export const fetchAccountLimitApi = (request: Account): Promise<AccountLimit> => {
  return axiosADLInstance
    .post<Account, AxiosResponse<{ bankLimit: AccountLimit }>>('/customer-security/get-limits-nat-acc', request)
    .then(response => response.data.bankLimit[0]);
};

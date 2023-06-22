import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/constants';
import { AffiliatedAccount } from './afilliated-accounts.entity';

export const getAffiliatedAccountsApi = (): Promise<AffiliatedAccount[]> => {
  return axiosADLInstance
    .post<Record<string, never>, AxiosResponse<{ acctBalancesList: AffiliatedAccount[] }>>(
      'transfer-core/get-affiliated-accounts',
      {}
    )
    .then(response => response.data.acctBalancesList);
};

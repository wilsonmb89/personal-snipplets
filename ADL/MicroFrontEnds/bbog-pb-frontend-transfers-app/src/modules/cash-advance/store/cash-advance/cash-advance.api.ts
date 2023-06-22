import { AxiosResponse } from 'axios';

import { axiosADLInstance } from '@utils/constants';
import { CashAdvanceRq, CashAdvanceRs } from './cash-advance.entity';

export const cashAdvanceApi = (request: CashAdvanceRq): Promise<CashAdvanceRs> => {
  return axiosADLInstance
    .post<CashAdvanceRq, AxiosResponse<CashAdvanceRs>>('internal-transfer/credit-card-advance/add', request)
    .then(response => response.data);
};

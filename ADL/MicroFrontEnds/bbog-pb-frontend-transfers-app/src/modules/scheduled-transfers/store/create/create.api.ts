import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/constants';
import { CreateScheduledTransferRq, CreateScheduledTransferRs } from './create.entity';

export const createScheduledTransferApi = (
  createScheduledTransferRq: CreateScheduledTransferRq
): Promise<CreateScheduledTransferRs> => {
  return axiosADLInstance
    .post<CreateScheduledTransferRq, AxiosResponse<CreateScheduledTransferRs>>(
      'transfer-account/add-scheduled',
      createScheduledTransferRq
    )
    .then(response => response.data);
};

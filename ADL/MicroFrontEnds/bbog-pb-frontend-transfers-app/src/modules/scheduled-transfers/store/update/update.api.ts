import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/constants';
import { UpdateScheduledTransferRq, UpdateScheduledTransferRs } from './update.entity';

export const modifyScheduledTransferApi = (
  updateScheduledTransferRq: UpdateScheduledTransferRq
): Promise<UpdateScheduledTransferRs> => {
  return axiosADLInstance
    .post<UpdateScheduledTransferRq, AxiosResponse<UpdateScheduledTransferRs>>(
      'transfer-account/modify-scheduled',
      updateScheduledTransferRq
    )
    .then(response => response.data);
};

import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/constants';
import { CreateScheduledTransferRs } from '../create/create.entity';
import { DeleteScheduledTransferRq } from './scheduled-transfer-delete.entity';

export const deleteScheduledTransferApi = (
  deleteScheduledTransferRq: DeleteScheduledTransferRq
): Promise<CreateScheduledTransferRs> => {
  return axiosADLInstance
    .post<DeleteScheduledTransferRq, AxiosResponse<CreateScheduledTransferRs>>(
      'transfer-account/delete-scheduled',
      deleteScheduledTransferRq
    )
    .then(response => response.data);
};

import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/constants';
import { ScheduleTransfersList } from './scheduled-transfer-list.entity';

export const getScheduleTransfersList = (): Promise<ScheduleTransfersList[]> => {
  return axiosADLInstance
    .post<Record<string, never>, AxiosResponse<{ scheduleTransfersResponseList: ScheduleTransfersList[] }>>(
      'transfer-account/scheduled',
      {}
    )
    .then(response => response.data.scheduleTransfersResponseList);
};

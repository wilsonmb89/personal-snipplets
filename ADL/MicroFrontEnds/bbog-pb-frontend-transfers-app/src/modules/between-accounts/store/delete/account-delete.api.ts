import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/constants';

import { DeleteAccountRequest, DeleteAccountResponse } from './account-delete.entity';

export const deleteAccountApi = (deleteScheduledTransferRq: DeleteAccountRequest): Promise<DeleteAccountResponse> => {
  return axiosADLInstance
    .post<DeleteAccountRequest, AxiosResponse<DeleteAccountResponse>>(
      `transfer-core/delete-account`,
      deleteScheduledTransferRq
    )
    .then(response => response.data);
};

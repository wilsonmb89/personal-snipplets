import { axiosADLInstance } from '@utils/constants';
import { NewAccountRequest, NewAccountResponse } from './account-add.entity';

export const addNewAccountApi = (request: NewAccountRequest): Promise<NewAccountResponse> => {
  return axiosADLInstance
    .post<NewAccountRequest, NewAccountResponse>(`transfer-core/add-account`, request)
    .then(response => response);
};

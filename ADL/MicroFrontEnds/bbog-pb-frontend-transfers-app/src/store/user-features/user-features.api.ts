import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/constants';
import { UserFeatures } from './user-features.entity';

export const fetchUserFeaturesApi = (): Promise<UserFeatures> => {
  return axiosADLInstance
    .post<Record<string, never>, AxiosResponse<UserFeatures>>('user-features/get-user-settings', {})
    .then(response => response.data);
};

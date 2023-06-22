import { AxiosResponse } from 'axios';
import { UserSettingsState } from './user-features.entity';
import { axiosADLInstance } from '@utils/constants';

export const fetchUserSettingsApi = (): Promise<UserSettingsState> => {
  return axiosADLInstance
    .post<Record<string, never>, AxiosResponse<UserSettingsState>>('user-features/get-user-settings', {})
    .then(response => response.data);
};

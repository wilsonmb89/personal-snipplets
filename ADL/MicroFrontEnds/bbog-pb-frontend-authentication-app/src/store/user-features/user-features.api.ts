import { AxiosResponse } from 'axios';
import { axiosADLInstance } from '@utils/axios-instance';
import { SettingsTermsAndConditions, TermsAndConditionsItem, UserFeatures } from './user-features.entity';

export const fetchTermsAndConditionsApi = (): Promise<TermsAndConditionsItem[]> => {
  return axiosADLInstance
    .post<Record<string, never>, AxiosResponse<TermsAndConditionsItem[]>>('/user-features/get-terms-and-conditions', {})
    .then(response => response.data);
};

export const saveTermsAndConditionsApi = (termsAndConditionsRq: SettingsTermsAndConditions): Promise<UserFeatures> => {
  return axiosADLInstance
    .post<SettingsTermsAndConditions, AxiosResponse<UserFeatures>>('/user-features/user-settings', termsAndConditionsRq)
    .then(response => response.data);
};

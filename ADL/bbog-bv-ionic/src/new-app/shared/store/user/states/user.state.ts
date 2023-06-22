import { Catalogue } from '../../../../core/services-apis/user-features/models/catalogue.model';
import { LastLoginRs } from 'new-app/core/services-apis/identity-validation/models/last-login.model';
import { UserFeatures } from '../../../../core/services-apis/user-features/models/UserFeatures';
import { BasicDataRs } from '@app/apis/customer-basic-data/models/getBasicData.model';

export interface UserState {
  lastLogin: LastLoginRs;
  publicKey: string;
  diffTime: number;
  basicData: BasicDataRs;
  userFeaturesData: UserFeaturesData;
  catalogs: Catalogs;
}

export interface UserFeaturesData {
  userFeatures: UserFeatures;
  working: boolean;
  completed: boolean;
  error: any;
}

export interface Catalogs {
  [catalogueType: string]: Catalogue[];
}

export const initialState: UserState = {
  lastLogin: {
    currentIp: '127.0.0.1',
    currentTime: new Date().toLocaleString(),
    lastLoginTime: new Date().toLocaleString(),
  },
  publicKey: null,
  diffTime: null,
  basicData: null,
  userFeaturesData: {
    userFeatures: null,
    working: false,
    completed: false,
    error: null
  },
  catalogs: {}
};

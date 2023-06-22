import { BasicDataRs } from '@app/apis/customer-basic-data/models/getBasicData.model';
import { Action } from '@ngrx/store';
import { UserFeatures } from '../../../../core/services-apis/user-features/models/UserFeatures';

// PUBLIC KEY ACTIONS

export const USER_PUBLIC_KEY = '[User/API] Get user public key';
export const USER_PUBLIC_KEY_SUCCESS = '[User/API] Get user public key success';
export const USER_PUBLIC_KEY_ERROR = '[User/API] Get user public key error';

export class PublicKeyAction implements Action {
  readonly type = USER_PUBLIC_KEY;
}

export class PublicKeySuccessAction implements Action {
  readonly type = USER_PUBLIC_KEY_SUCCESS;

  constructor(public publicKey: string, public diffTime: number) {}
}

export class PublicKeyErrorAction implements Action {
  readonly type = USER_PUBLIC_KEY_ERROR;
}

// USER BASIC DATA ACTIONS

export const USER_BASIC_DATA = '[User/API] Get user basic data';
export const USER_BASIC_DATA_SUCCESS = '[User/API] Get user basic data success';
export const USER_BASIC_DATA_ERROR = '[User/API] Get user basic data error';
export const USER_BASIC_DATA_REFRESH = '[User/API] Refresh user basic data';
export const USER_BASIC_DATA_REFRESH_SUCCESS = '[User/API] Refresh user basic data success';
export const USER_BASIC_DATA_REFRESH_ERROR = '[User/API] Refresh user basic data error';

export class BasicDataAction implements Action {
  readonly type = USER_BASIC_DATA;
}

export class BasicDataSuccessAction implements Action {
  readonly type = USER_BASIC_DATA_SUCCESS;

  constructor(public basicData: BasicDataRs) {}
}

export class BasicDataErrorAction implements Action {
  readonly type = USER_BASIC_DATA_ERROR;
}

export class BasicDataRefreshAction implements Action {
  readonly type = USER_BASIC_DATA_REFRESH;
}

export class BasicDataRefreshSuccessAction implements Action {
  readonly type = USER_BASIC_DATA_REFRESH_SUCCESS;

  constructor(public basicData: BasicDataRs) {}
}

export class BasicDataRefreshErrorAction implements Action {
  readonly type = USER_BASIC_DATA_REFRESH_ERROR;
}

// USER FEATURES ACTIONS

export const USER_FEATURES_DATA = '[User/API] Get user features data';
export const USER_FEATURES_UPDATE = '[User/API] Update user features data';
export const USER_FEATURES_REFRESH = '[User/API] Refresh user features data';
export const USER_FEATURES_SUCCESS = '[User/API] Get user features data success';
export const USER_FEATURES_ERROR = '[User/API] Get user features data error';
export const USER_FEATURES_REMOVE = '[User/API] Remove user features data';

export class UserFeaturesAction implements Action {
  readonly type = USER_FEATURES_DATA;
}

export class UserFeaturesUpdateAction implements Action {
  readonly type = USER_FEATURES_UPDATE;

  constructor(
    public userFeatures: UserFeatures
  ) {}
}

export class UserFeaturesRefreshAction implements Action {
  readonly type = USER_FEATURES_REFRESH;
}

export class UserFeaturesSuccessAction implements Action {
  readonly type = USER_FEATURES_SUCCESS;

  constructor(
    public userFeatures: UserFeatures
  ) {}
}

export class UserFeaturesErrorAction implements Action {
  readonly type = USER_FEATURES_ERROR;

  constructor(
    public error: any
  ) {}
}

export class UserFeaturesRemoveAction implements Action {
  readonly type = USER_FEATURES_REMOVE;
}

// UTIL ACTIONS

export const USER_RESET = '[User/API] Reset user state';

export class UserResetAction implements Action {
  readonly type = USER_RESET;
}

export type UserSettingsActions =
  | PublicKeyAction
  | PublicKeySuccessAction
  | PublicKeyErrorAction
  | BasicDataAction
  | BasicDataSuccessAction
  | BasicDataErrorAction
  | BasicDataRefreshAction
  | BasicDataRefreshSuccessAction
  | BasicDataRefreshErrorAction
  | UserFeaturesAction
  | UserFeaturesUpdateAction
  | UserFeaturesRefreshAction
  | UserFeaturesSuccessAction
  | UserFeaturesErrorAction
  | UserFeaturesRemoveAction
  | UserResetAction;

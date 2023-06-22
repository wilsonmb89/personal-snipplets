import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../states/user.state';

export const userState = createFeatureSelector<UserState>('userState');

export const lastLoginSelector = createSelector(
  userState,
  (state: UserState) => state.lastLogin
);

export const basicDataSelector = createSelector(
  userState,
  (state: UserState) => state.basicData
);

export const userFeaturesStateSelector = createSelector(
  userState,
  (state: UserState) => state.userFeaturesData
);

export const userFeaturesDataSelector = createSelector(
  userState,
  (state: UserState) => state.userFeaturesData.userFeatures
);

export const userFeaturesWorkingSelector = createSelector(
  userState,
  (state: UserState) => state.userFeaturesData.working
);

export const userFeaturesCompletedSelector = createSelector(
  userState,
  (state: UserState) => state.userFeaturesData.completed
);

export const userFeaturesErrorSelector = createSelector(
  userState,
  (state: UserState) => state.userFeaturesData.error
);


import { Dispatch } from '@reduxjs/toolkit';
import { loadingHandler } from '@store/loader/loader.store';
import { isEqual } from 'lodash';
import { RootState } from '..';
import { fetchUserSettingsApi } from './user-features.api';
import { initialState } from './user-features.entity';
import { userSettingsActions } from './user-features.reducer';

export const fetchUserSettings = (): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    if (!isEqual(state.userSettingsState, initialState)) {
      return;
    }
    const userSettings = await fetchUserSettingsApi();
    dispatch(userSettingsActions.fetchUserSettingsSuccess(userSettings));
  };
  return loadingHandler.bind(null, fetch);
};

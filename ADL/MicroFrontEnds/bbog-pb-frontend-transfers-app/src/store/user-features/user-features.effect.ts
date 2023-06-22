import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '..';
import { loadingHandler } from '../loader/loader.store';
import { isEqual } from 'lodash';
import { initialState } from './user-features.entity';
import { fetchUserFeaturesApi } from './user-features.api';
import { userFeaturesActions } from './user-features.reducer';

export const fetchUserFeatures = (force = false): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    if (!isEqual(state.userFeaturesState, initialState) && !force) {
      return;
    }
    try {
      const userFeatures = await fetchUserFeaturesApi();
      dispatch(userFeaturesActions.fetchUserFeaturesSuccess(userFeatures));
    } catch (error) {
      console.error(error);
    }
  };
  return loadingHandler.bind(null, fetch);
};

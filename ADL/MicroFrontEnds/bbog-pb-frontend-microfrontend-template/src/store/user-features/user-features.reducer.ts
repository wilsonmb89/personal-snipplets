import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sessionStorageReducer } from '../session-storage.reducer';
import { initialState, UserFeatures } from './user-features.entity';

export const userFeaturesState = createSlice({
  name: 'UserFeaturesState',
  initialState,
  reducers: {
    fetchUserFeaturesSuccess(state, { payload }: PayloadAction<UserFeatures>) {
      state.customer = payload.customer;
      state.settings = payload.settings;
      state.toggle = payload.toggle;
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'UserFeaturesState', ['fetchUserFeaturesSuccess']);
  }
});

export const userFeaturesActions = userFeaturesState.actions;

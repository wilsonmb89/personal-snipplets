import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sessionStorageReducer } from '../session-storage.reducer';
import { initialState, UserSettingsState } from './user-features.entity';

export const createUserSettingsState = createSlice({
  name: 'UserSettingsState',
  initialState,
  reducers: {
    fetchUserSettingsSuccess(_state, { payload }: PayloadAction<UserSettingsState>) {
      return { ...payload };
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'UserSettingsState', ['fetchUserSettingsSuccess']);
  }
});

export const userSettingsActions = createUserSettingsState.actions;

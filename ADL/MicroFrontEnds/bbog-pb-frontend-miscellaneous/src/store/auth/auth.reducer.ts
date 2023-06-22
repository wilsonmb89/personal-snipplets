import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './auth.entity';
import { sessionStorageReducer } from '../session-storage.reducer';

export const createAuthState = createSlice({
  name: 'AuthState',
  initialState,
  reducers: {},
  extraReducers: builder => {
    sessionStorageReducer(builder, 'AuthState', []);
  }
});

export const authActions = createAuthState.actions;

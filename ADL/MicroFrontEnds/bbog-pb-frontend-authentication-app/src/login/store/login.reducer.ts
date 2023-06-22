import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, LoginRequest } from './login.entity';
import { sessionStorageReducer } from '@store/session-storage.reducer';

export const loginState = createSlice({
  name: 'loginState',
  initialState,
  reducers: {
    setLoginRequest(state, { payload }: PayloadAction<LoginRequest>) {
      state.credentials = payload.credentials;
      state.options = payload.options;
    },
    clear(state) {
      state.credentials = initialState.credentials;
      state.options = initialState.options;
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'loginState', ['setLoginRequest', 'clear']);
  }
});

export const loginActions = loginState.actions;

import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';

const initialState = {
  isLoggedIn: null
};

export const createAuthorizationState = createSlice({
  name: 'AuthorizationState',
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    }
  }
});

export const authorizationActions = createAuthorizationState.actions;

export const isLoggedInSelector = (state: RootState): boolean => state.authorizationState.isLoggedIn;

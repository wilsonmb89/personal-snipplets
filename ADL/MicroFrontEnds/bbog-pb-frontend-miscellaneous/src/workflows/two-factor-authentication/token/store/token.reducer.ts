import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './token.entity';

export const createTokenState = createSlice({
  name: 'TokenState',
  initialState,
  reducers: {
    tokenValidationSuccess(state) {
      return {
        ...state,
        isTokenValid: true
      };
    },
    tokenValidationError(state) {
      return {
        ...state,
        attemps: state.attemps - 1
      };
    },
    reset() {
      return { ...initialState };
    }
  }
});

export const tokenActions = createTokenState.actions;

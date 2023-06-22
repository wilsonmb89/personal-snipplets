import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sessionStorageReducer } from '../session-storage.reducer';
import { initialState } from './balances.entity';

export const balanceState = createSlice({
  name: 'BalanceState',
  initialState,
  reducers: {
    setConsumed(state, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        isConsumed: payload
      };
    },
    setError(state, { payload }: PayloadAction<Error>) {
      return {
        ...state,
        error: payload
      };
    },
    reset() {
      return {
        ...initialState
      };
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'BalanceState', ['setConsumed']);
  }
});

export const balanceActions = balanceState.actions;

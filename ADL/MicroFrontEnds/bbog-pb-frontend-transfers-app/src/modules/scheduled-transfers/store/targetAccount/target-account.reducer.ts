import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sessionStorageReducer } from '../../../../store/session-storage.reducer';
import { initialState, TargetAccountState } from './target-account.entity';

export const targetAccountState = createSlice({
  name: 'TargetAccountState',
  initialState,
  reducers: {
    setTargetAccount(state, { payload }: PayloadAction<TargetAccountState>) {
      state.accountAlias = payload.accountAlias;
      state.accountType = payload.accountType;
      state.accountId = payload.accountId;
      state.bankId = payload.bankId;
      state.bankName = payload.bankName;
      state.isAval = payload.isAval;
    },
    reset() {
      return { ...initialState };
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'TargetAccountState', ['setTargetAccount', 'reset']);
  }
});

export const targetAccountActions = targetAccountState.actions;

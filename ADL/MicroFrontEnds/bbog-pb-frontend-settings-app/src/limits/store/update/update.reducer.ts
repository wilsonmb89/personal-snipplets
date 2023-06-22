import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Limit } from '../../models/limit.model';
import { Account } from '../../models/account.model';
import { initialState } from './update.entity';
import { sessionStorageReducer } from '../../../store/session-storage.reducer';

export const createUpdateLimitState = createSlice({
  name: 'UpdateLimitState',
  initialState,
  reducers: {
    setAccountForUpdate(state, { payload }: PayloadAction<Account>) {
      state.acctId = payload.acctId;
      state.acctType = payload.acctType;
    },
    setLimitForUpdate(state, { payload }: PayloadAction<Omit<Limit, 'desc'>>) {
      state.limit = payload;
    },
    reset(state) {
      state.acctId = initialState.acctId;
      state.acctType = initialState.acctType;
      state.limit = initialState.limit;
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'UpdateLimitState', ['setAccountForUpdate', 'reset']);
  }
});

export const updateLimitActions = createUpdateLimitState.actions;

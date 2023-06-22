import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account, CreateScheduledTransferRq, initialState } from './create.entity';

export const createScheduledTransferState = createSlice({
  name: 'CreateScheduledTransferState',
  initialState,
  reducers: {
    setScheduledTransferForCreate(state, { payload }: PayloadAction<CreateScheduledTransferRq>) {
      state.request = { ...state.request, ...payload };
      state.error = null;
    },
    setAccountTo(state, { payload }: PayloadAction<Account>) {
      state.request = { ...state.request, accountTo: { ...payload } };
    },
    createScheduledTransferError(state, { payload }: PayloadAction<Error>) {
      state.request = initialState.request;
      state.error = payload;
    },
    createScheduledTransferHandleError(state) {
      state.error = null;
    },
    reset(state) {
      state.request = initialState.request;
      state.error = null;
    }
  }
});

export const createScheduledTransferActions = createScheduledTransferState.actions;

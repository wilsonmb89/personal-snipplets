import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeleteScheduledTransferRq, initialState } from './scheduled-transfer-delete.entity';

export const deleteScheduledTransferState = createSlice({
  name: 'DeleteScheduledTransferState',
  initialState,
  reducers: {
    setIdScheduledTransferDelete(state, { payload }: PayloadAction<DeleteScheduledTransferRq>) {
      state.request = payload;
      state.error = null;
    },
    deleteScheduledTransferError(state, { payload }: PayloadAction<Error>) {
      state.request = initialState.request;
      state.error = payload;
    },
    reset(state) {
      state.request = initialState.request;
      state.error = null;
    }
  }
});

export const deleteScheduledTransferActions = deleteScheduledTransferState.actions;

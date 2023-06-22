import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sessionStorageReducer } from '../../../../store/session-storage.reducer';
import { initialState, ScheduleTransfersList, scheduleTransfersListAdapter } from './scheduled-transfer-list.entity';

export const scheduledTransferListState = createSlice({
  name: 'scheduledTransferListState',
  initialState,
  reducers: {
    fetchScheduledTransferList(state, { payload }: PayloadAction<ScheduleTransfersList[]>) {
      scheduleTransfersListAdapter.setAll(state.scheduleTransfersList, payload);
      state.error = null;
      state.completed = true;
    },
    fetchScheduledTransferListError(state, { payload }: PayloadAction<Error>) {
      state.scheduleTransfersList = initialState.scheduleTransfersList;
      state.error = payload;
      state.completed = false;
    },
    addScheduledTransfer(state, { payload }: PayloadAction<ScheduleTransfersList>) {
      scheduleTransfersListAdapter.addOne(state.scheduleTransfersList, payload);
      state.error = null;
      state.completed = true;
    },
    updateScheduledTransfer(state, { payload }: PayloadAction<ScheduleTransfersList>) {
      scheduleTransfersListAdapter.upsertOne(state.scheduleTransfersList, payload);
      state.error = null;
      state.completed = true;
    },
    deleteScheduledTransfer(state, { payload }: PayloadAction<string>) {
      scheduleTransfersListAdapter.removeOne(state.scheduleTransfersList, payload);
      state.error = null;
      state.completed = true;
    },
    reset(state) {
      state.scheduleTransfersList = initialState.scheduleTransfersList;
      state.error = null;
      state.completed = false;
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'scheduledTransferListState', [
      'fetchScheduledTransferList',
      'addScheduledTransfer',
      'updateScheduledTransfer',
      'deleteScheduledTransfer',
      'reset'
    ]);
  }
});

export const scheduledTransferListActions = scheduledTransferListState.actions;

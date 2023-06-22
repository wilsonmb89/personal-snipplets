import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './scheduled-transfer-selected.entity';
import { ScheduleTransfersList } from '../list/scheduled-transfer-list.entity';
import { sessionStorageReducer } from '../../../../store/session-storage.reducer';

export const scheduledTransferSelectedState = createSlice({
  name: 'ScheduledTransferSelectedState',
  initialState,
  reducers: {
    setScheduledTransferSelected(state, { payload }: PayloadAction<ScheduleTransfersList>) {
      state.scheduleTransferSelected = payload;
    },
    reset(state) {
      state.scheduleTransferSelected = initialState.scheduleTransferSelected;
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'ScheduledTransferSelectedState', ['setScheduledTransferSelected', 'reset']);
  }
});

export const scheduledTransferSelectedActions = scheduledTransferSelectedState.actions;

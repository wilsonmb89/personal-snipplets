import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

// TODO: rename interface to ScheduleTransfers
export interface ScheduleTransfersList {
  destinationAccountHolderIdType: string;
  destinationAccountHolderIdNumber: string;
  amount: number;
  scheduleId: string;
  nextExecutionDate: string; //2021-07-25T00:00:00.000Z
  scheduledCount: number;
  pendingCount: number;
  description: string;
  frequency: string;
  accountFrom: Account;
  accountTo: Account;
  status: string;
  recurrent: boolean;
}

export interface Account {
  acctId: string;
  acctType: string;
  bankId: string;
  bankName: string;
}

export interface ScheduleTransfersListState {
  scheduleTransfersList: EntityState<ScheduleTransfersList>;
  error: Error | null;
  completed: boolean;
}

export const scheduleTransfersListAdapter = createEntityAdapter<ScheduleTransfersList>({
  selectId: (scheduleTransfersList: ScheduleTransfersList) => scheduleTransfersList.scheduleId
});

export const initialState: ScheduleTransfersListState = {
  scheduleTransfersList: scheduleTransfersListAdapter.getInitialState({
    ids: [],
    entities: {}
  }),
  error: null,
  completed: false
};

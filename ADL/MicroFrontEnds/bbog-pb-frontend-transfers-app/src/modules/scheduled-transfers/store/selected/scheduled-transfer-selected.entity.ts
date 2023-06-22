import { ScheduleTransfersList } from '../list/scheduled-transfer-list.entity';

export interface ScheduleTransfersSelectedtState {
  scheduleTransferSelected: ScheduleTransfersList;
}

export const initialState: ScheduleTransfersSelectedtState = {
  scheduleTransferSelected: {
    destinationAccountHolderIdType: null,
    destinationAccountHolderIdNumber: null,
    amount: null,
    scheduleId: null,
    nextExecutionDate: null,
    scheduledCount: null,
    pendingCount: null,
    description: null,
    frequency: null,
    accountFrom: {
      acctId: null,
      acctType: null,
      bankId: null,
      bankName: null
    },
    accountTo: {
      acctId: null,
      acctType: null,
      bankId: null,
      bankName: null
    },
    status: null,
    recurrent: null
  }
};

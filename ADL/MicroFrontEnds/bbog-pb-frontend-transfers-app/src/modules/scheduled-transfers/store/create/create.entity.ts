export interface CreateScheduledTransferRs {
  message: string;
  approvalId: string;
  requestId: string;
}

export interface CreateScheduledTransferRq {
  accountFrom: Account;
  accountTo?: Account;
  nextExecutionDate: string;
  amount: string;
  destinationAccountHolderIdNumber: string;
  destinationAccountHolderIdType: string;
  description: string;
  frequency: string;
  countType?: string;
  count: number;
}

export interface Account {
  accountType: string;
  accountId: string;
  bankId: string;
}

export interface CreateScheduledTransferState {
  request: CreateScheduledTransferRq;
  error: Error | null;
}

export const initialState: CreateScheduledTransferState = {
  request: {
    accountFrom: {
      accountType: null,
      accountId: null,
      bankId: null
    },
    accountTo: {
      accountType: null,
      accountId: null,
      bankId: null
    },
    nextExecutionDate: null,
    amount: null,
    destinationAccountHolderIdNumber: null,
    destinationAccountHolderIdType: null,
    description: null,
    frequency: null,
    countType: null,
    count: null
  },
  error: null
};

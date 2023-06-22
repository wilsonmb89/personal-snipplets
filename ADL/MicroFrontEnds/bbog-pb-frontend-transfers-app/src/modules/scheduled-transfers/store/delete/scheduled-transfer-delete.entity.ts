export interface DeleteScheduledTransferRq {
  scheduledId: string;
}

export interface DeleteScheduledTransferState {
  request: DeleteScheduledTransferRq;
  error: Error | null;
}

export const initialState: DeleteScheduledTransferState = {
  request: {
    scheduledId: null
  },
  error: null
};

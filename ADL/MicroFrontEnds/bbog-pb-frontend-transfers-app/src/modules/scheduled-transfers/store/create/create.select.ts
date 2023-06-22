import { RootState } from '../../../../store';
import { CreateScheduledTransferRq, CreateScheduledTransferState } from './create.entity';

export const createScheduledTransferState = (state: RootState): CreateScheduledTransferState =>
  state.createScheduledTransferState;

export const createScheduledRequestSelector = (state: RootState): CreateScheduledTransferRq =>
  state.createScheduledTransferState.request;

export const createScheduledErrorSelector = (state: RootState): Error => state.createScheduledTransferState.error;

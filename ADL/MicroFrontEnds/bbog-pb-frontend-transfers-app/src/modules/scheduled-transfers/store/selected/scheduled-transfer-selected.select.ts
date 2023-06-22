import { RootState } from '../../../../store';
import { ScheduleTransfersList } from '../list/scheduled-transfer-list.entity';

export const getScheduleTransferSelected = (state: RootState): ScheduleTransfersList =>
  state.scheduledTransferSelectedState.scheduleTransferSelected;

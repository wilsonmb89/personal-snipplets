import { scheduleTransfersListSelector } from '../list/scheduled-transfer-list.select';
import { Dispatch } from 'redux';
import { RootState } from '../../../../store/index';
import { scheduledTransferSelectedActions } from './scheduled-transfer-selected.reducer';
import { scheduleTransfersListAdapter } from '../list/scheduled-transfer-list.entity';

const { selectById } = scheduleTransfersListAdapter.getSelectors();

export const setScheduledTransferSelected = (id: string): ((dispatch: Dispatch, getState: () => RootState) => void) => {
  return (dispatch: Dispatch, getState: () => RootState): void => {
    const state = getState();
    const scheduleTransfersListState = scheduleTransfersListSelector(state);
    const product = selectById(scheduleTransfersListState.scheduleTransfersList, id);
    dispatch(scheduledTransferSelectedActions.setScheduledTransferSelected(product));
  };
};

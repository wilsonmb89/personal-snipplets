import { loadingHandler } from '../../../../store/loader/loader.store';
import { Dispatch } from 'redux';
import { scheduledTransferListActions } from './scheduled-transfer-list.reducer';
import { getScheduleTransfersList } from './scheduled-transfer-list.api';
import { RootState } from '../../../../store';
import { isEqual } from 'lodash';
import { initialState } from './scheduled-transfer-list.entity';

export const fetchScheduleList = (options?: { force?: boolean; disableLoader?: boolean }): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    if (
      !isEqual(state.scheduledTransferListState.scheduleTransfersList, initialState.scheduleTransfersList) &&
      !options.force
    ) {
      return;
    }
    dispatch(scheduledTransferListActions.fetchScheduledTransferList);
    try {
      const list = await getScheduleTransfersList();
      dispatch(scheduledTransferListActions.fetchScheduledTransferList(list));
    } catch (error) {
      dispatch(scheduledTransferListActions.fetchScheduledTransferListError(error));
    }
  };

  return options.disableLoader ? fetch : loadingHandler.bind(null, fetch);
};

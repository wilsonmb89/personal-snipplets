import { Dispatch } from 'redux';
import { RootState } from '../../../../store';
import { loadingHandler } from '../../../../store/loader/loader.store';
import { showToast } from '../../../../store/toast/toast.store';
import { scheduledTransferListActions } from '../list/scheduled-transfer-list.reducer';
import { deleteScheduledTransferApi } from './scheduled-transfer-delete.api';
import { deleteScheduledTransferActions } from './scheduled-transfer-delete.reducer';

const ERROR_TOAST_PROPS = 'La programación no se pudo eliminar, por favor inténtalo más tarde.';

export const fetchDeleteScheduledTransfer = (scheduledId: string): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    dispatch(deleteScheduledTransferActions.setIdScheduledTransferDelete({ scheduledId }));
    const state = getState();
    const { request } = state.deleteScheduledTransferState;
    try {
      await deleteScheduledTransferApi(request);
      dispatch(scheduledTransferListActions.deleteScheduledTransfer(scheduledId));
    } catch (error) {
      dispatch(deleteScheduledTransferActions.deleteScheduledTransferError(error));
      dispatch(showToast({ text: ERROR_TOAST_PROPS, type: 'error' }));
    }
  };
  return loadingHandler.bind(null, fetch);
};

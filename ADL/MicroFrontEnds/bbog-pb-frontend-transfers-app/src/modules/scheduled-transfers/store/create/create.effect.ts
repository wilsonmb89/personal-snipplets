import { Dispatch } from 'redux';
import {
  BUSINESS_ERROR_CODE,
  DUPLICATED_CODE,
  ERROR_DUPLICATED_MESSAGE
} from '../../../../constants/error-scheduled-transfer';
import { RootState } from '../../../../store';
import { showError } from '../../../../store/error/error.store';
import { loadingHandler } from '../../../../store/loader/loader.store';
import { scheduledTransferListActions } from '../list/scheduled-transfer-list.reducer';
import { createScheduledTransferApi } from './create.api';
import { CreateScheduledTransferRq } from './create.entity';
import { createScheduledTransferActions } from './create.reducer';
import { generateDataToList } from '../list/scheduled-transfer-list.select';

const ERROR_MESSAGE: Error = {
  name: 'No se pudo programar tu transferencia',
  message: 'En estos momentos no se pudo realizar la programación. Por favor inténtalo más tarde.'
};

export const createScheduledTransfer = (dataRequest: CreateScheduledTransferRq): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    dispatch(createScheduledTransferActions.setScheduledTransferForCreate(dataRequest));
    const state = getState();
    const { request } = state.createScheduledTransferState;
    try {
      const { approvalId } = await createScheduledTransferApi(request);
      const payload = generateDataToList(state, { ...request, scheduledId: approvalId });
      dispatch(scheduledTransferListActions.addScheduledTransfer(payload));
    } catch (error) {
      dispatch(createScheduledTransferActions.createScheduledTransferError(error));
      const { data } = error;
      if (data.status === BUSINESS_ERROR_CODE) {
        // ToDo improve error translation method
        const typeMessageError = handleBusinessError(error);
        dispatch(showError(typeMessageError));
      } else {
        dispatch(showError(ERROR_MESSAGE));
      }
    }
  };
  return loadingHandler.bind(null, fetch);
};

const handleBusinessError = (error): Error => {
  return error.data.data.businessErrorCode === DUPLICATED_CODE ? ERROR_DUPLICATED_MESSAGE : ERROR_MESSAGE;
};

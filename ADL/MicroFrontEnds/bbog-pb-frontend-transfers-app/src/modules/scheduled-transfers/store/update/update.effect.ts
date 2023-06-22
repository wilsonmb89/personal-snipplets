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
import { generateDataToList } from '../list/scheduled-transfer-list.select';
import { modifyScheduledTransferApi } from './update.api';
import { UpdateScheduledTransferRq } from './update.entity';

const ERROR_MESSAGE: Error = {
  name: 'No se pudo modificar tu programación',
  message: 'En estos momentos no se pudo realizar la programación. Por favor inténtalo más tarde. '
};

export const updateScheduledTransfer = (dataRequest: UpdateScheduledTransferRq): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    try {
      await modifyScheduledTransferApi(dataRequest);
      const payload = generateDataToList(state, dataRequest, false);
      dispatch(scheduledTransferListActions.updateScheduledTransfer(payload));
    } catch (error) {
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

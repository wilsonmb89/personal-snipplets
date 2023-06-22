import { Dispatch } from 'redux';
import { loadingHandler } from '../../../../store/loader/loader.store';
import { transferToAccountApi } from './account-transfer.api';
import { TransferRequest } from './account-transfer.entity';
import { transferAccountActions } from './account-transfer.reducer';

export const fetchDoTransfer = (request: TransferRequest): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch): Promise<void> => {
    try {
      const { approvalId, message, requestId } = await transferToAccountApi(request);
      //TODO should manage error with different vouchers
      dispatch(
        transferAccountActions.setTransferResponse({
          approvalId,
          message,
          requestId,
          status: 200
        })
      );
    } catch (error) {
      //TODO should manage error with differentd modals and remove catch external
      return Promise.reject(error);
    }
  };
  return loadingHandler.bind(null, fetch);
};

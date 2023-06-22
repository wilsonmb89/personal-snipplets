import { Dispatch } from 'redux';
import { loadingHandler } from '../../../../store/loader/loader.store';
import { showToast, Toasts } from '../../../../store/toast/toast.store';
import { deleteAccountApi } from './account-delete.api';
import { DeleteAccountRequest } from './account-delete.entity';

import { affiliatedAccountsActions } from '../../../../store/affiliated-accounts/afilliated-accounts.reducer';

const SUCCESS_TOAST_PROPS = 'La cuenta ha sido eliminada';

export const fetchDeleteAccount = (request: DeleteAccountRequest): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch): Promise<void> => {
    try {
      await deleteAccountApi(request);
      dispatch(affiliatedAccountsActions.deleteAffiliatedAccount(request));
      dispatch(showToast({ text: SUCCESS_TOAST_PROPS, type: Toasts.SUCCESS }));
    } catch (error) {
      return Promise.reject(error);
    }
  };
  return loadingHandler.bind(null, fetch);
};

import { loadingHandler } from '../loader/loader.store';
import { Dispatch } from 'redux';
import { affiliatedAccountsActions } from './afilliated-accounts.reducer';
import { getAffiliatedAccountsApi } from './afilliated-accounts.api';
import { showError } from '../error/error.store';

import { isEqual } from 'lodash';
import { initialState } from './afilliated-accounts.entity';

const ERROR_MESSAGE: Error = {
  name: 'Error al cargar la lista de cuentas afiliadas',
  message: 'En estos momentos no podemos crear la programación de la transferencia. Por favor inténtalo más tarde.'
};

export const fetchAffiliatedAccountsList = (options?: {
  force?: boolean;
  disableLoader?: boolean;
  showModal?: boolean;
}): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState): Promise<void> => {
    dispatch(affiliatedAccountsActions.fetchAffiliatedAccounts);

    const state = getState();
    if (
      !isEqual(state.affiliatedAccountsState.affiliatedAccounts, initialState.affiliatedAccounts) &&
      !options?.force
    ) {
      return;
    }

    try {
      const affiliatedAccounts = await getAffiliatedAccountsApi();
      dispatch(affiliatedAccountsActions.fetchAffiliatedAccounts(affiliatedAccounts));
    } catch (error) {
      dispatch(affiliatedAccountsActions.fetchAffiliatedAccountsError(error));
      if (options?.showModal) dispatch(showError(ERROR_MESSAGE));
    }
  };
  return options?.disableLoader ? fetch : loadingHandler.bind(null, fetch);
};

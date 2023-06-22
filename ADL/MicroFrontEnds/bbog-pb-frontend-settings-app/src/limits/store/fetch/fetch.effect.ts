import { Dispatch } from 'redux';
import { showError } from '../../../store/error/error.store';
import { loadingHandler } from '../../../store/loader/loader.store';
import { Account } from '../../models/account.model';
import { fetchAccountLimitApi, fetchLimitsApi } from './fetch.api';
import { limitsActions } from './fetch.reducer';

export const fetchLimits = (
  account: Account,
  options?: { force?: boolean; disableLoader?: boolean }
): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch): Promise<void> => {
    try {
      const limits = await fetchLimitsApi(account);
      dispatch(limitsActions.fetchLimitsSuccess(limits));
    } catch (error) {
      dispatch(
        showError({
          name: 'Error al cargar los Topes',
          message: 'En estos momentos no pudimos cargar los Topes de tu cuenta. Por favor intenta nuevamente.'
        })
      );
      throw error;
    }
  };
  return options.disableLoader ? fetch : loadingHandler.bind(null, fetch);
};

export const fetchAccountLimit = (
  account: Account,
  options?: { force?: boolean; disableLoader?: boolean }
): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch): Promise<void> => {
    try {
      const accountLimit = await fetchAccountLimitApi(account);
      dispatch(limitsActions.fetchAccountLimitSuccess(accountLimit));
    } catch (error) {
      dispatch(
        showError({
          name: 'Error al cargar los Topes',
          message: 'En estos momentos no pudimos cargar los Topes de tu cuenta. Por favor intenta nuevamente.'
        })
      );
      throw error;
    }
  };
  return options.disableLoader ? fetch : loadingHandler.bind(null, fetch);
};

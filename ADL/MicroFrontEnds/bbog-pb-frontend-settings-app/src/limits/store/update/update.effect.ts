import { Dispatch } from 'redux';
import { RootState } from '../../../store';
import { showError } from '../../../store/error/error.store';
import { loadingHandler } from '../../../store/loader/loader.store';
import { showToast } from '../../../store/toast/toast.store';
import { limitsActions } from '../fetch/fetch.reducer';
import { updateAccountLimitApi, updateLimitApi } from './update.api';
import { UpdateAccountLimitRequest } from './update.entity';

const successToastProps = 'Cambio de topes exitoso';
const ERROR_MESSAGE: Error = {
  name: 'Error al modificar topes',
  message: 'En estos momentos no podemos hacer el cambio de tus topes. Por favor inténtalo más tarde.'
};

const buildAccountLimitRequest = (getState: () => RootState): UpdateAccountLimitRequest => {
  const state = getState();
  const { accountLimit } = state.limitsState;
  const newRequest = {
    ...state.updateLimitState,
    limit: { ...accountLimit, amount: state.updateLimitState.limit.amount }
  };
  return newRequest;
};

export const updateLimit = (): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    try {
      await updateLimitApi(state.updateLimitState);
      dispatch(limitsActions.updateLimitSuccess(state.updateLimitState.limit));
      dispatch(limitsActions.closeAllLimitItems());
      dispatch(showToast(successToastProps));
    } catch (error) {
      dispatch(showError(ERROR_MESSAGE));
      throw error;
    }
  };

  return loadingHandler.bind(null, fetch);
};

export const updateAccountLimit = (): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const request = buildAccountLimitRequest(getState);
    try {
      await updateAccountLimitApi(request);
      dispatch(limitsActions.updateAccountLimitSuccess(request.limit));
      dispatch(limitsActions.closeAllLimitItems());
      dispatch(showToast(successToastProps));
    } catch (error) {
      dispatch(showError(ERROR_MESSAGE));
      throw error;
    }
  };

  return loadingHandler.bind(null, fetch);
};

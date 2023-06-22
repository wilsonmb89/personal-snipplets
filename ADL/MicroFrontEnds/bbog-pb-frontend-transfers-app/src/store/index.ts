import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { name } from '../../package.json';

import { createScheduledTransferState } from '../modules/scheduled-transfers/store/create/create.reducer';
import { targetAccountState } from '../modules/scheduled-transfers/store/targetAccount/target-account.reducer';
import { catalogsState } from './catalogs/catalogs.reducer';
import { createErrorState } from './error/error.store';
import { createLoaderState } from './loader/loader.store';
import { createProductsState } from './products/products.reducer';
import { userFeaturesState } from './user-features/user-features.reducer';
import { createPulseToastState } from './toast/toast.store';
import { scheduledTransferListState } from '../modules/scheduled-transfers/store/list/scheduled-transfer-list.reducer';
import { affiliatedAccountsState } from './affiliated-accounts/afilliated-accounts.reducer';
import { scheduledTransferSelectedState } from '../modules/scheduled-transfers/store/selected/scheduled-transfer-selected.reducer';
import { deleteScheduledTransferState } from '../modules/scheduled-transfers/store/delete/scheduled-transfer-delete.reducer';
import { createShellEventsState } from './shell-events/shell-events.store';
import { accountSelectedState } from '../modules/between-accounts/store/selected/account-selected.reducer';
import { createNewAccountState } from '../modules/between-accounts/store/add/account-add.reducer';
import { transferAccountState } from '../modules/between-accounts/store/transfer/account-transfer.reducer';
import { balanceState } from './balances/balance.reducer';
import { cashAdvanceWorkflowState } from '../modules/cash-advance/store/cash-advance-workflow/cash-advance-workflow.reducer';
import { cardsInfoState } from './cards-info/cards-info.reducer';

const devTools = process.env.TAG === 'PRO' ? false : { name };

const appReducer = combineReducers({
  shellEventsState: createShellEventsState.reducer,
  createScheduledTransferState: createScheduledTransferState.reducer,
  loaderState: createLoaderState.reducer,
  errorState: createErrorState.reducer,
  targetAccountState: targetAccountState.reducer,
  productsState: createProductsState.reducer,
  userFeaturesState: userFeaturesState.reducer,
  catalogsState: catalogsState.reducer,
  toastState: createPulseToastState.reducer,
  scheduledTransferListState: scheduledTransferListState.reducer,
  affiliatedAccountsState: affiliatedAccountsState.reducer,
  scheduledTransferSelectedState: scheduledTransferSelectedState.reducer,
  deleteScheduledTransferState: deleteScheduledTransferState.reducer,
  accountSelectedState: accountSelectedState.reducer,
  newAccountState: createNewAccountState.reducer,
  transferAccountState: transferAccountState.reducer,
  balanceState: balanceState.reducer,
  cashAdvanceWorkflowState: cashAdvanceWorkflowState.reducer,
  cardsInfoState: cardsInfoState.reducer
});

const rootReducer = (state, action) => {
  if (action.type === 'UNMOUNT') {
    return appReducer(undefined, action);
  }

  if (action.type === 'MOUNT') {
    return appReducer(state, action);
  }

  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  devTools
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

export type AppDispatch = typeof store.dispatch;

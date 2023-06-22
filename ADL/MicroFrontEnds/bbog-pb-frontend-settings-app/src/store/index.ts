import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { createLimitsState } from '../limits/store/fetch/fetch.reducer';
import { createUpdateLimitState } from '../limits/store/update/update.reducer';
import { createCatalogsState } from './catalogs/catalogs.reducer';
import { createErrorState } from './error/error.store';
import { createLoaderState } from './loader/loader.store';
import { createProductsState } from './products/products.reducer';
import { createPulseToastState } from './toast/toast.store';
import { createTokenState } from './token/token.store';

const appReducer = combineReducers({
  limitsState: createLimitsState.reducer,
  updateLimitState: createUpdateLimitState.reducer,
  productsState: createProductsState.reducer,
  loaderState: createLoaderState.reducer,
  errorState: createErrorState.reducer,
  catalogsState: createCatalogsState.reducer,
  toastState: createPulseToastState.reducer,
  tokenState: createTokenState.reducer
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
  devTools: process.env.TAG !== 'PRO'
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

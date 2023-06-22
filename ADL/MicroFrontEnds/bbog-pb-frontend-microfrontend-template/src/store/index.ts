import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLoaderState } from './loader/loader.store';
import { createErrorState } from './error/error.store';
import { createPulseToastState } from './toast/toast.store';
import { userFeaturesState } from './user-features/user-features.reducer';
import { catalogsState } from './catalogs/catalogs.reducer';
import { createProductsState } from './products/products.reducer';

const appReducer = combineReducers({
  loaderState: createLoaderState.reducer,
  errorState: createErrorState.reducer,
  toastState: createPulseToastState.reducer,
  userFeaturesState: userFeaturesState.reducer,
  catalogsState: catalogsState.reducer,
  productsState: createProductsState.reducer
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
export type AppDispatch = typeof store.dispatch;

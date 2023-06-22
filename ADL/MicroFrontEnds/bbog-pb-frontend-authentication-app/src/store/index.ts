import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLoaderState } from './loader/loader.store';
import { createShellEventsState } from './shell-events/shell-events.store';
import { loginState } from '@login/store//login.reducer';
import { customerState } from '@secure-key/store/customer/customer.store';
import { otpAuthState } from '@secure-key/store/otp-auth/otp-auth.reducer';
import { validationProductsState } from '@secure-key/store/validation-products/validation-products.reducer';

const appReducer = combineReducers({
  shellEventsState: createShellEventsState.reducer,
  loaderState: createLoaderState.reducer,
  loginState: loginState.reducer,
  customerState: customerState.reducer,
  OTPAuthState: otpAuthState.reducer,
  validationProductsState: validationProductsState.reducer
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
export type AppDispatch = typeof store.dispatch;
export default store;

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLoaderState } from './loader/loader.store';
import { createSherpaToastState } from './toast/toast.store';
import { createUserSettingsState } from './user-features/user-features.reducer';
import { createTokenState } from '../workflows/two-factor-authentication/token/store/token.reducer';
import { createOTPState } from '../workflows/two-factor-authentication/otp/store/otp.reducer';
import { createAuthState } from './auth/auth.reducer';
import { name } from '../../package.json';

const devTools = process.env.TAG === 'PRO' ? false : { name };

const appReducer = combineReducers({
  loaderState: createLoaderState.reducer,
  toastState: createSherpaToastState.reducer,
  userSettingsState: createUserSettingsState.reducer,
  tokenState: createTokenState.reducer,
  otpState: createOTPState.reducer,
  authState: createAuthState.reducer
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

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createAuthorizationState } from './authorization.store';
import { name } from '../../package.json';

import { createRouterState } from './router.store';

const devTools = process.env.TAG === 'PRO' ? false : { name };

const appReducer = combineReducers({
  routerState: createRouterState.reducer,
  authorizationState: createAuthorizationState.reducer
});

const rootReducer = (state, action) => {
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  devTools
});

export type RootState = ReturnType<typeof store.getState>;

export default store;

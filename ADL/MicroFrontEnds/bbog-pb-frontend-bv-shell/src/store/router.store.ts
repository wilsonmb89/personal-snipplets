import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

const initialState = {
  currentRoute: null,
  isLoading: false
};

export const createRouterState = createSlice({
  name: 'RouterState',
  initialState,
  reducers: {
    route(state, { payload }: PayloadAction<string>) {
      state.currentRoute = payload;
    },
    showLoader(state) {
      state.isLoading = true;
    },
    hideLoader(state) {
      state.isLoading = false;
    }
  }
});

export const routerActions = createRouterState.actions;

export const routeSelector = (state: RootState): string => state.routerState.currentRoute;
export const isLoadingSelector = (state: RootState): boolean => state.routerState.isLoading;

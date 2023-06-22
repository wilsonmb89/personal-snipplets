import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface ShellEventsState {
  externalRoute: string | number;
  mainPage: boolean;
}

const initialState: ShellEventsState = {
  externalRoute: null,
  mainPage: null
};

export const createShellEventsState = createSlice({
  name: 'ShellEventsState',
  initialState,
  reducers: {
    externalNavigate(state, { payload }: PayloadAction<string | number>) {
      state.externalRoute = payload;
    },
    setMainPage(state, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        mainPage: payload
      };
    }
  }
});

export const externalNavigate = createShellEventsState.actions.externalNavigate;
export const setMainPage = createShellEventsState.actions.setMainPage;

export const externalRouteSelector = (state: RootState): string | number => state.shellEventsState.externalRoute;
export const mainPageSelector = (state: RootState): boolean => state.shellEventsState.mainPage;

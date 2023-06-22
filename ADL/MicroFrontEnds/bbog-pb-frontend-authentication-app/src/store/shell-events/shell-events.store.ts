import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface ShellEventsState {
  externalRoute: string | number;
}

const initialState: ShellEventsState = { externalRoute: null };

export const createShellEventsState = createSlice({
  name: 'ShellEventsState',
  initialState,
  reducers: {
    externalNavigate(state, { payload }: PayloadAction<string | number>) {
      state.externalRoute = payload;
    }
  }
});

export const externalNavigate = createShellEventsState.actions.externalNavigate;

export const externalRouteSelector = (state: RootState): string | number => state.shellEventsState.externalRoute;

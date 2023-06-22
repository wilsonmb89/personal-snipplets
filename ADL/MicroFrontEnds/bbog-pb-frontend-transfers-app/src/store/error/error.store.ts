import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

const DEFAULT_PRIMARY_ACTION = 'Entendido';

interface ErrorState {
  error: Error | null;
  primaryAction: string;
}

const initialState: ErrorState = {
  error: null,
  primaryAction: DEFAULT_PRIMARY_ACTION
};

export const createErrorState = createSlice({
  name: 'ErrorState',
  initialState,
  reducers: {
    setActionText(state, { payload }: PayloadAction<string>): ErrorState {
      return { ...state, primaryAction: payload };
    },
    show(state, { payload }: PayloadAction<Error>): ErrorState {
      return { ...state, error: payload };
    },
    dismiss() {
      return { ...initialState };
    }
  }
});

export const dismissError = createErrorState.actions.dismiss;
export const showError = createErrorState.actions.show;
export const setActionText = createErrorState.actions.setActionText;

export const errorSelector = (state: RootState): Error => state.errorState.error;
export const actionSelector = (state: RootState): string => state.errorState.primaryAction;

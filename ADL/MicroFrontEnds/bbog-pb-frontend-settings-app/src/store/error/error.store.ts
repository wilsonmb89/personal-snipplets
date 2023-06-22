import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface ErrorState {
  error: Error | null;
}

const initialState: ErrorState = { error: null };

export const createErrorState = createSlice({
  name: 'ErrorState',
  initialState,
  reducers: {
    show(state, { payload }: PayloadAction<Error>) {
      state.error = payload;
    },
    dismiss(state) {
      state.error = null;
    }
  }
});

export const dismissError = createErrorState.actions.dismiss;
export const showError = createErrorState.actions.show;

export const errorSelector = (state: RootState): Error => state.errorState.error;

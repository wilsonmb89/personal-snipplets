import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

interface PulseToastState {
  text: string;
}

const initialState: PulseToastState = {
  text: null
};

export const createPulseToastState = createSlice({
  name: 'PulseToastState',
  initialState,
  reducers: {
    show(state, { payload }: PayloadAction<string>) {
      state.text = payload;
    },
    dismiss(state) {
      state.text = null;
    }
  }
});

export const dismissToast = createPulseToastState.actions.dismiss;
export const showToast = createPulseToastState.actions.show;

export const toastTextSelector = (state: RootState): string => state.toastState.text;

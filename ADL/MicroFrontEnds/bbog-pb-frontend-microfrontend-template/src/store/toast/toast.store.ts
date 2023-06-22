import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

type ToastTypes = 'success' | 'error' | 'warning' | 'information';
interface PulseToastState {
  text: string;
  type: ToastTypes;
}

const initialState: PulseToastState = {
  text: null,
  type: null
};

export const createPulseToastState = createSlice({
  name: 'PulseToastState',
  initialState,
  reducers: {
    show(state, { payload }: PayloadAction<PulseToastState>) {
      state.text = payload.text;
      state.type = payload.type;
    },
    dismiss(state) {
      state.text = initialState.text;
      state.type = initialState.type;
    }
  }
});

export const dismissToast = createPulseToastState.actions.dismiss;
export const showToast = createPulseToastState.actions.show;

export const toastSelector = (state: RootState): PulseToastState => state.toastState;

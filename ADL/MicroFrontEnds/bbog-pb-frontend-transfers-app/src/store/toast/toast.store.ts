import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export enum Toasts {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WRNING = 'WARNING',
  INFORMATION = 'INFO'
}

export type ToastType = `${Toasts}`;

export interface PulseToastState {
  title: string;
  text: string;
  description: string;
  type: ToastType;
  textLink: string;
}

const initialState: PulseToastState = {
  title: null,
  text: '',
  description: '',
  type: null,
  textLink: null
};

export const createPulseToastState = createSlice({
  name: 'PulseToastState',
  initialState,
  reducers: {
    show(state, { payload }: PayloadAction<Partial<PulseToastState>>): PulseToastState {
      return { ...state, ...payload };
    },
    dismiss(): PulseToastState {
      return { ...initialState };
    }
  }
});

export const dismissToast = createPulseToastState.actions.dismiss;
export const showToast = createPulseToastState.actions.show;

export const toastSelector = (state: RootState): PulseToastState => state.toastState;

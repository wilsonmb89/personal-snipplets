import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store/index';

interface SherpaToastState {
  show: boolean;
  data: SherpaToastData;
}

export interface SherpaToastData {
  type: string;
  title: string;
  message: string;
}

const initialState: SherpaToastState = {
  show: null,
  data: null
};

export const createSherpaToastState = createSlice({
  name: 'SherpaToastState',
  initialState,
  reducers: {
    show(state, { payload }: PayloadAction<SherpaToastData>) {
      return {
        ...state,
        data: { ...payload },
        show: true
      };
    },
    dismiss(state) {
      return {
        ...state,
        data: null,
        show: false
      };
    }
  }
});

export const dismissToast = createSherpaToastState.actions.dismiss;
export const showToast = createSherpaToastState.actions.show;

export const toastStateSelector = (state: RootState): SherpaToastState => state.toastState;

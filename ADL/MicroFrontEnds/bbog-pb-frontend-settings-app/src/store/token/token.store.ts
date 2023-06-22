import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { TokenStatus, initialState, TokenInfo } from './token.entity';

export const createTokenState = createSlice({
  name: 'TokenState',
  initialState,
  reducers: {
    showTokenModal(state) {
      state.attemps = 3;
      state.status = 1;
      state.showModal = true;
    },
    hideTokenModal(state) {
      state.showModal = false;
    },
    fetchTokenInfo(state, { payload }: PayloadAction<TokenInfo>) {
      state.tokenInfo = payload;
    },
    fetchTokenAttemptSuccess(state) {
      state.status = 2;
      state.showModal = false;
    },
    fetchTokenAttempWrong(state) {
      state.attemps = state.attemps - 1;
      state.status = 3;
      state.showModal = true;
    },
    fetchTokenAttemptFail(state) {
      state.status = 4;
      state.showModal = true;
    },
    fetchTokenAttemptError(state) {
      state.status = 5;
      state.showModal = true;
    },
    showNeedTokenModal(state) {
      state.attemps = 0;
      state.status = 6;
      state.showModal = true;
    }
  }
});

export const tokenActions = createTokenState.actions;

export const tokenStatusSelector = (state: RootState): TokenStatus => state.tokenState.status;
export const tokenAttemptsSelector = (state: RootState): number => state.tokenState.attemps;
export const tokenInfoSelector = (state: RootState): TokenInfo => state.tokenState.tokenInfo;
export const tokenShowModalSelector = (state: RootState): boolean => state.tokenState.showModal;

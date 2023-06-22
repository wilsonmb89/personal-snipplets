import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState, TransferAccount, TransferResponse } from './account-transfer.entity';
import { sessionStorageReducer } from '../../../../store/session-storage.reducer';

export const transferAccountState = createSlice({
  name: 'TransferAccountState',
  initialState,
  reducers: {
    setTransferAccount(state, { payload }: PayloadAction<TransferAccount>) {
      return {
        ...state,
        accountTransfer: payload
      };
    },
    setTransferResponse(state, { payload }: PayloadAction<TransferResponse>) {
      return {
        ...state,
        transferResponse: payload
      };
    },
    reset(state) {
      return {
        ...state,
        accountTransfer: initialState.accountTransfer,
        transferResponse: initialState.transferResponse
      };
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'TransferAccountState', ['setTransferAccount', 'reset']);
  }
});

export const transferAccountActions = transferAccountState.actions;

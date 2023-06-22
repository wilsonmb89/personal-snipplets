import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './account-selected.entity';
import { sessionStorageReducer } from '../../../../store/session-storage.reducer';
import { Product } from '../../../../store/products/products.entity';

export const accountSelectedState = createSlice({
  name: 'AccountSelectedState',
  initialState,
  reducers: {
    setAccountOwnSelected(state, { payload }: PayloadAction<Product>) {
      return {
        ...state,
        accountOwnSelected: payload
      };
    },
    reset(state) {
      return {
        ...state,
        accountOwnSelected: initialState.accountOwnSelected
      };
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'AccountSelectedState', []);
  }
});

export const accountSelectActions = accountSelectedState.actions;

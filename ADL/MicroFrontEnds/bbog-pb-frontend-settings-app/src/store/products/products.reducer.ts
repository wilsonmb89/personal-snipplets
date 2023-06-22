import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './products.entity';
import { sessionStorageReducer } from '../session-storage.reducer';
import { initialState, productsAdapter } from './products.entity';

export const createProductsState = createSlice({
  name: 'ProductsState',
  initialState,
  reducers: {
    fetchProductsSuccess(state, { payload }: PayloadAction<Product[]>) {
      productsAdapter.setAll(state.products, payload);
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'ProductsState', ['fetchProductsSuccess'], {
      entityAdapter: productsAdapter,
      stateAdapterAttribute: 'products'
    });
  }
});

export const productsActions = createProductsState.actions;

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
    },
    updateProduct(state, { payload }: PayloadAction<Product>) {
      productsAdapter.upsertOne(state.products, payload);
    },
    setError(state, { payload }: PayloadAction<Error>) {
      return {
        ...state,
        error: payload
      };
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'ProductsState', ['fetchProductsSuccess', 'updateProduct'], {
      entityAdapter: productsAdapter,
      stateAdapterAttribute: 'products'
    });
  }
});

export const productsActions = createProductsState.actions;

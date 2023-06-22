import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductDetail } from '@utils/product-validation-util';
import { initialState, ValidationProductsState } from './validation-products.entity';

export const validationProductsState = createSlice({
  name: 'ValidationProductsState',
  initialState,
  reducers: {
    setValidationProducts(state, { payload }: PayloadAction<ValidationProductsState>) {
      return { ...state, validationProductInfoList: payload.validationProductInfoList };
    },
    setProductToValidate(state, { payload }: PayloadAction<ProductDetail>) {
      return { ...state, productToValidate: payload };
    },
    reset() {
      return { ...initialState };
    }
  }
});

export const validationProductsActions = validationProductsState.actions;

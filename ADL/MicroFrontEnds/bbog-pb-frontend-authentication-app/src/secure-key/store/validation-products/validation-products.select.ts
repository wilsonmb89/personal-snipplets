import { RootState } from '@store/index';
import { ProductDetail } from '@utils/product-validation-util';
import { ValidationProductInfo } from './validation-products.entity';

export const getProducts = (state: RootState): ValidationProductInfo[] =>
  state.validationProductsState.validationProductInfoList;

export const getProductToValidate = (state: RootState): ProductDetail =>
  state.validationProductsState.productToValidate;

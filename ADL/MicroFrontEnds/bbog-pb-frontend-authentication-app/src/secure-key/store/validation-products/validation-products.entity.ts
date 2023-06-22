import { ProductDetail } from '@utils/product-validation-util';

export interface ValidationProductsState {
  validationProductInfoList: Array<ValidationProductInfo>;
  productToValidate?: ProductDetail;
}

export interface ValidationProductInfo {
  productNumber: string;
  productType: string;
  iterations: string;
  last4Digits: string;
}

export interface ValidatePinRq {
  accountId: string;
  accountType: string;
  accountSubtype: string;
  pinToValidate: string;
}

export const initialState: ValidationProductsState = {
  validationProductInfoList: [],
  productToValidate: {
    digits: '',
    label: '',
    message: '',
    placeholder: ''
  }
};

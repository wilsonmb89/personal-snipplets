import { encrypt } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '@store/index';
import { loadingHandler } from '@store/loader/loader.store';
import { getProductDetail, ProductValidationType } from '@utils/product-validation-util';
import { productValidationErrors } from '@secure-key/constants/secure-key-modal-messages';
import { ValidatePinRq } from './validation-products.entity';
import { validatePinApi, validationProductsApi } from './validation-products.api';
import { validationProductsActions } from './validation-products.reducer';
import { OTPAuthState } from '../otp-auth/otp-auth.entity';

const VISA = 'VISA';
const DEBIT = 'Debit';

export const fetchProducts = (): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    const { accessToken, sessionId, tokenVersion, cdtOwner } = state.OTPAuthState as OTPAuthState;
    sessionStorage.setItem(
      btoa('AuthState'),
      encrypt({ accessToken, sessionId, tokenVersion, cdtOwner, channel: 'RG_PB' })
    );
    const products = await validationProductsApi();
    dispatch(validationProductsActions.setValidationProducts(products));
    const product = products.validationProductInfoList[0];
    const productDetail = getProductDetail(product.productType as ProductValidationType);
    dispatch(validationProductsActions.setProductToValidate(productDetail));
  };
  return loadingHandler.bind(null, fetch);
};

export const validateDebitPin = (pinToValidate: string, productNumber: string): (() => Promise<void>) => {
  const fetch = async (_dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    const products = state.validationProductsState.validationProductInfoList;
    const product = products.find(product => product.productNumber.substr(-4) === productNumber);
    if (!product) throw productValidationErrors.debitNotExists;
    await validatePinApi(getValidatePinRq(product.productNumber, pinToValidate));
  };
  return loadingHandler.bind(null, fetch);
};

const getValidatePinRq = (productNumber: string, pinToValidate: string): ValidatePinRq => {
  return {
    accountId: productNumber,
    accountType: DEBIT,
    accountSubtype: VISA,
    pinToValidate
  };
};

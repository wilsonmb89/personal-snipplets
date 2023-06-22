import { md as forgeMd, util as forgeUtil, pkcs5 as forgePkcs5 } from 'node-forge';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '@store/index';
import { getCustomer, getFlowData } from '@secure-key/store/customer/customer.store';
import { validateDebitPin } from '@secure-key/store/validation-products/validation-product.effect';
import { ProductValidationForm } from '@secure-key/pages/product-validation/ProductValidation';
import { getProducts } from '@secure-key/store/validation-products/validation-products.select';
import { loadingActions } from '@store/loader/loader.store';
import showNotificationModal from '@components/core/modal-notification';

interface UseProductValidation {
  validateProduct: (values: ProductValidationForm) => void;
  errorValidation: boolean;
}

export const useProductValidation = (): UseProductValidation => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const flowData = useSelector(getFlowData);
  const customer = useSelector(getCustomer);
  const products = useSelector(getProducts);
  const [errorValidation, setErrorValidation] = useState(false);
  const SERVER_ERROR = 500;
  const DEBIT_NOT_EXIST = -1;

  const validateProduct = (values: ProductValidationForm) => {
    setErrorValidation(false);
    if (values.productNumber) {
      Promise.resolve(dispatch(validateDebitPin(values.productKey, values.productNumber)))
        .then(() => navigate(flowData.createKeyPath))
        .catch(error => showErrorModal(error));
    } else {
      dispatch(loadingActions.enable());
      setTimeout(() => {
        validateOtherProducts(values.productKey);
      }, 1000);
    }
  };

  const validateOtherProducts = (pinToValidate: string) => {
    const isCorrect = compareProductHash(pinToValidate);
    if (isCorrect) {
      navigate(flowData.createKeyPath);
    }
    setErrorValidation(true);
    dispatch(loadingActions.disable());
  };

  const showErrorModal = error => {
    if (error.status >= SERVER_ERROR || error.status === DEBIT_NOT_EXIST) {
      const { type, name, message } = error;
      showNotificationModal({ type, name, message }, [
        { text: 'Entendido', action: () => (error.status === DEBIT_NOT_EXIST ? null : navigate('/')) }
      ]);
    } else {
      setErrorValidation(true);
    }
  };

  const compareProductHash = (pinToValidate: string): boolean => {
    const identificationNumber = customer.identificationNumber;
    const isHashCorrect = products.reduce((lastHashWasCorrect, product) => {
      const md = forgeMd.sha512.create();
      const hash = forgePkcs5.pbkdf2(pinToValidate, identificationNumber, Number(product.iterations), 64, md);
      const hash64 = forgeUtil.encode64(hash);
      const isCorrect = product.productNumber === hash64;
      return lastHashWasCorrect || isCorrect;
    }, false);
    return isHashCorrect;
  };

  return { validateProduct, errorValidation };
};

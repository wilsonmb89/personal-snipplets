import React, { useEffect, useState } from 'react';
import styles from './ProductValidation.module.scss';
import FormLayout from '@components/core/form-layout/FormLayout';
import FormSecureKey from '@secure-key/components/form-secure-key/FormSecureKey';
import showNotificationModal from '@components/core/modal-notification';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { fieldRegistry } from '@utils/utils';
import { AuthBdbAtInput } from '@utils/sherpa-tagged-components';
import { InputKeyProps } from '@constants/form-input-props';
import { getProductToValidate } from '@secure-key/store/validation-products/validation-products.select';
import { getFlowData, getRegisterBasicData } from '@secure-key/store/customer/customer.store';
import { useProductValidation } from '@secure-key/hooks/useProductValidation';
import { productValidationErrors } from '@secure-key/constants/secure-key-modal-messages';

export interface ProductValidationForm {
  productKey: string;
  productNumber?: string;
}

const ProductValidation = (): JSX.Element => {
  const navigate = useNavigate();
  const [validationCount, setValidationCount] = useState(0);
  const customerData = useSelector(getRegisterBasicData);
  const product = useSelector(getProductToValidate);
  const flowData = useSelector(getFlowData);
  const DEBIT_DIGITS = '4';
  const MAX_ATTEMPTS = 3;

  const productValidation = {
    title: `Hola, ${customerData.name}`,
    description: 'Para crear una nueva clave segura debes ingresar los datos del siguiente producto:'
  };

  const { register, handleSubmit, formState } = useForm<ProductValidationForm>({ mode: 'onChange' });
  const { isDirty, isValid } = formState;
  const { validateProduct, errorValidation } = useProductValidation();

  useEffect(() => {
    if (errorValidation) {
      setValidationCount(validationCount + 1);
      if (validationCount === MAX_ATTEMPTS - 1) {
        let errorMessage = productValidationErrors.productExceedAttemptsProducts;
        if (product.digits === DEBIT_DIGITS) {
          errorMessage = productValidationErrors.productExceedAttemptsTD;
        }
        showNotificationModal(errorMessage, [{ text: 'Entendido', action: () => navigate('/') }]);
      }
    }
  }, [errorValidation]);

  return (
    <div className={styles['product-validation']} data-testid="product-validation">
      <FormLayout title={flowData.title}>
        <div className={styles['product-validation__title']}>
          <span className="sherpa-typography-heading-6">Creemos una nueva Clave Segura</span>
        </div>

        <FormSecureKey {...productValidation}>
          <div className={styles['product-validation__help-text']}>
            <span className={`${styles['product-validation__help-text__title']} sherpa-typography-body-2`}>
              Recuerda
            </span>
            <span className={`${styles['product-validation__help-text__body']} sherpa-typography-body-2`}>
              {product.message}
            </span>
          </div>
          <form noValidate onSubmit={handleSubmit(validateProduct)} data-testid="product-validation-form">
            {product.digits === DEBIT_DIGITS && (
              <div className={styles['product-validation__product-number']}>
                <AuthBdbAtInput
                  data-testid="product-number"
                  {...InputKeyProps.password}
                  label="Últimos 4 dígitos de tu Tarjeta Débito"
                  {...fieldRegistry(register('productNumber', { required: true }))}
                />
              </div>
            )}
            <div className={styles['product-validation__product-key']}>
              <AuthBdbAtInput
                data-testid="product-key"
                {...InputKeyProps.password}
                label={product.label}
                minlength={product.digits}
                maxlength={product.digits}
                placeholder={product.placeholder}
                status={errorValidation ? 'ERROR' : 'ENABLED'}
                message={`Código incorrecto, quedan ${MAX_ATTEMPTS - validationCount} intentos restantes.`}
                {...fieldRegistry(register('productKey', { required: true, minLength: +product.digits }))}
              />
            </div>
            <button
              className={`${styles['product-validation__submit']} bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg`}
              disabled={!isDirty || !isValid}
              type="submit"
            >
              Verificar
            </button>
          </form>
        </FormSecureKey>
      </FormLayout>
    </div>
  );
};

export default ProductValidation;

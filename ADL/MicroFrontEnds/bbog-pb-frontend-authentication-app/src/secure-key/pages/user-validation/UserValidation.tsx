import React, { useEffect, useState } from 'react';
import styles from './UserValidation.module.scss';
import FormLayout from '@components/core/form-layout/FormLayout';
import FormSecureKey from '@secure-key/components/form-secure-key/FormSecureKey';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fieldRegistry } from '@utils/utils';
import { AuthBdbAtDropdown, AuthBdbAtInput } from '@utils/sherpa-tagged-components';
import { dropdownIdentificaionProps, inputIdentificationProps } from '@constants/form-input-props';
import { getListWithShort } from '@constants/identification-list';
import { secureKeyPageData } from '@secure-key/constants/secure-key-constants';
import { customerActions } from '@secure-key/store/customer/customer.store';
import { useValidateUser } from '@secure-key/hooks/useValidateUser';

export interface UserValidationForm {
  documentType: string;
  documentNumber: string;
}

const UserValidation = (): JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageConstants, setPageConstants] = useState(secureKeyPageData.register);
  const { validateUser } = useValidateUser();
  const { register, handleSubmit, setValue, formState } = useForm<UserValidationForm>({ mode: 'onChange' });
  const { isDirty, isValid } = formState;

  useEffect(() => {
    const isForget = location.pathname.includes(secureKeyPageData.forget.userValidationPath);
    dispatch(customerActions.setIsForgetFlow(isForget));
    if (isForget) {
      setPageConstants(secureKeyPageData.forget);
    }
  }, []);

  const userValidation = {
    title: pageConstants.clientValidation,
    description: 'Ingresa los siguientes datos y ten a la mano la información de tus productos.'
  };

  const handleDocumentTypeSelect = (event: CustomEvent) => {
    setValue('documentType', event.detail.value, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className={styles['user-validation']} data-testid="user-validation">
      <FormLayout title={pageConstants.title}>
        <div className={styles['user-validation__title']}>
          <span className="sherpa-typography-heading-6">Verifiquemos que eres tú</span>
        </div>

        <FormSecureKey {...userValidation}>
          <form noValidate onSubmit={handleSubmit(validateUser)} data-testid="user-validation-form">
            <div className={styles['user-validation__form']}>
              <div className={styles['user-validation__form__identification-type']}>
                <AuthBdbAtDropdown
                  data-testid="identification-type"
                  {...dropdownIdentificaionProps}
                  options={getListWithShort}
                  defaultvalue={getListWithShort[0].value}
                  onElementSelectedAtom={handleDocumentTypeSelect}
                />
              </div>
              <div className={styles['user-validation__form__identification-number']}>
                <AuthBdbAtInput
                  data-testid="identification-number"
                  label="Número"
                  {...inputIdentificationProps}
                  {...fieldRegistry(register('documentNumber', { required: true }))}
                />
              </div>
            </div>
            <button
              className={`${styles['user-validation__submit']} bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg`}
              disabled={!isDirty || !isValid}
              data-testid="verify-button"
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

export default UserValidation;

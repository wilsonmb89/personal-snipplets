import React, { useState } from 'react';
import styles from './CreateKey.module.scss';
import FormLayout from '@components/core/form-layout/FormLayout';
import FormSecureKey from '@secure-key/components/form-secure-key/FormSecureKey';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fieldRegistry } from '@utils/utils';
import { AuthBdbAtInput } from '@utils/sherpa-tagged-components';
import { InputKeyProps } from '@constants/form-input-props';
import { getFlowData } from '@secure-key/store/customer/customer.store';
import { useCreateKey } from '@secure-key/hooks/useCreateKey';

export interface CreateKeyForm {
  newKey: string;
  confirmationKey: string;
}

const CreateKey = (): JSX.Element => {
  const flowData = useSelector(getFlowData);
  const [errorKey, setErrorKey] = useState(false);
  const { createNewKey } = useCreateKey();
  const { register, handleSubmit, formState, getValues } = useForm<CreateKeyForm>({ mode: 'onChange' });
  const { isDirty, isValid } = formState;

  const registerValidation = {
    title: 'Define tu nueva Clave Segura',
    description: 'Para finalizar el proceso, asigna y confirma los 4 dígitos de tu nueva clave segura.'
  };

  const validateKeys = () => {
    const { newKey, confirmationKey } = getValues();
    if (confirmationKey.length === 4) {
      setErrorKey(newKey !== confirmationKey);
    }
  };

  return (
    <div className={styles['register']} data-testid="create-key">
      <FormLayout title={flowData.title}>
        <div className={styles['register__title']}>
          <span className="sherpa-typography-heading-6">Creemos una nueva clave segura</span>
        </div>
        <FormSecureKey {...registerValidation}>
          <form noValidate onSubmit={handleSubmit(createNewKey)} data-testid="register-form">
            <div className={styles['register__key']}>
              <AuthBdbAtInput
                data-testid="secure-key"
                className={styles['register__key']}
                {...InputKeyProps.secure}
                label="Ingresa tu nueva Clave Segura"
                {...fieldRegistry(register('newKey', { required: true, minLength: 4 }))}
              />
            </div>
            <div className={styles['register__key']}>
              <AuthBdbAtInput
                data-testid="confirm-secure-key"
                className={styles['register__key']}
                {...InputKeyProps.secure}
                label="Confirma tu nueva Clave Segura"
                message="La clave no coincide"
                status={errorKey ? 'ERROR' : 'ENABLED'}
                onAtInputUpdated={validateKeys}
                {...fieldRegistry(register('confirmationKey', { required: true, minLength: 4 }))}
              />
            </div>
            <button
              className={`${styles['register__submit']} bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg`}
              disabled={!isDirty || !isValid || errorKey}
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

export default CreateKey;

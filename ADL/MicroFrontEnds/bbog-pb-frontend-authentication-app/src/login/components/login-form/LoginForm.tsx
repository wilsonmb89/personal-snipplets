import React, { useEffect, useState } from 'react';
import styles from './LoginForm.module.scss';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getListWithShort } from '@constants/identification-list';
import { inputIdentificationProps, InputKeyProps } from '@constants/form-input-props';
import { AuthBdbMlSecondtabs, AuthBdbAtDropdown, AuthBdbAtInput } from '@utils/sherpa-tagged-components';
import { fieldRegistry } from '@utils/utils';
import { useLogin } from '@login/hooks/useLogin';
import { secureKeyPageData } from '@secure-key/constants/secure-key-constants';

enum LoginOptionsEnum {
  SECURE_PASS = 1,
  DEBIT_CARD = 2
}
export interface LoginFormInputs {
  identificationType: string;
  identificationNumber: string;
  password: string;
  lastDigitDebitCard: string;
  loginWeb: boolean;
  tabSecure?: boolean;
}

const LoginForm = (): JSX.Element => {
  const [tabSecure, setTabSecure] = useState(true);
  const navigate = useNavigate();
  const { submitLogin } = useLogin();

  const { register, handleSubmit, setValue, formState, resetField } = useForm<LoginFormInputs>({
    mode: 'onChange'
  });
  const { isDirty, isValid } = formState;

  useEffect(() => {
    setValue('tabSecure', true);
    setValue('loginWeb', false);
  }, []);

  const handleTabSelect = (tab: CustomEvent) => {
    setTabSecure(tab.detail.id === LoginOptionsEnum.SECURE_PASS);
    setValue('tabSecure', tab.detail.id === LoginOptionsEnum.SECURE_PASS);
    resetField('password');
    resetField('lastDigitDebitCard');
  };

  const handleIdentificationTypeSelect = (identificationType: CustomEvent) => {
    setValue('identificationType', identificationType.detail.value, { shouldDirty: true, shouldValidate: true });
  };

  const navigateSecureKey = (isRegister: boolean) => {
    const path = isRegister
      ? secureKeyPageData.register.userValidationPath
      : secureKeyPageData.forget.userValidationPath;
    navigate(path);
  };

  return (
    <div className={styles['login']}>
      <AuthBdbMlSecondtabs
        data-testid="login-tabs"
        position="center"
        proportionalWidth
        onMlTabsChanged={handleTabSelect}
        tabs={`[{"id":${LoginOptionsEnum.SECURE_PASS},"title":"Clave segura","disabled":false},{"id":${LoginOptionsEnum.DEBIT_CARD},"title":"Tarjeta débito","disabled":false}]`}
      />
      <form noValidate onSubmit={handleSubmit(submitLogin)} data-testid="login-form">
        <div className={styles['login__form']}>
          <div className={styles['login__form__identification']}>
            <div className={styles['login__form__identification__type']}>
              <AuthBdbAtDropdown
                id="identificationType"
                name="identificationType"
                label="Identificación"
                placeholder="Selecciona"
                data-testid="identification-type"
                options={getListWithShort}
                defaultvalue={getListWithShort[0].value}
                onElementSelectedAtom={handleIdentificationTypeSelect}
              />
            </div>
            <div className={styles['login__form__identification__number']}>
              <AuthBdbAtInput
                data-testid="identification-number"
                {...inputIdentificationProps}
                {...fieldRegistry(register('identificationNumber', { required: true }))}
              />
            </div>
          </div>
          {tabSecure && (
            <div className={styles['login__form__secure']}>
              <AuthBdbAtInput
                data-testid="key-secure"
                {...InputKeyProps.secure}
                {...fieldRegistry(register('password', { required: tabSecure, minLength: 4 }))}
              />
            </div>
          )}
          {!tabSecure && (
            <div className={styles['login__form__debit']}>
              <div className={styles['login__form__debit__last-digits']}>
                <AuthBdbAtInput
                  {...InputKeyProps.last}
                  {...fieldRegistry(register('lastDigitDebitCard', { required: !tabSecure, minLength: 4 }))}
                />
              </div>
              <div className={styles['login__form__debit__password']}>
                <AuthBdbAtInput
                  {...InputKeyProps.password}
                  {...fieldRegistry(register('password', { required: !tabSecure, minLength: 4 }))}
                />
              </div>
            </div>
          )}

          <button
            className={`${styles['login__form__access']} bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg`}
            disabled={!isDirty || !isValid}
            type="submit"
          >
            Ingresar
          </button>

          {tabSecure && (
            <div className={styles['login__form__actions']}>
              <div className={styles['login__form__actions-register']}>
                <button
                  className={`${styles['login__form__actions-register__button']} bdb-at-btn bdb-at-btn--link bdb-at-btn--lg`}
                  onClick={() => navigateSecureKey(true)}
                  data-testid="register-button"
                >
                  <label>Registrarme &#8250;</label>
                </button>
              </div>
              <button
                className={`${styles['login__form__actions-forget']} bdb-at-btn bdb-at-btn--link bdb-at-btn--lg`}
                onClick={() => navigateSecureKey(false)}
                data-testid="forget-button"
              >
                <label>Olvidé mi clave &#8250;</label>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

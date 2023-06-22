import React, { useEffect, useState } from 'react';
import styles from './LoginWeb.module.scss';
import { useForm } from 'react-hook-form';
import { AuthBdbMlSecondtabs, AuthBdbAtDropdown, AuthBdbAtInput } from '@utils/sherpa-tagged-components';
import { inputIdentificationProps, InputKeyProps } from '@constants/form-input-props';
import { fieldRegistry } from '@utils/utils';
import { getList } from '@constants/identification-list';
import { version } from '@login/constants/login-page-constants';
import { useLogin } from '@login/hooks/useLogin';
import { LoginFormInputs } from '@login/components/login-form/LoginForm';
import { secureKeyPageData } from '@secure-key/constants/secure-key-constants';

enum LoginOptionsEnum {
  DEBIT_CARD = 1,
  SECURE_PASS = 2
}

const LoginWeb = (): JSX.Element => {
  const [tabSecure, setTabSecure] = useState(false);
  const { submitLogin, loginWebErrorMessage } = useLogin();
  const { register, handleSubmit, setValue, formState, resetField } = useForm<LoginFormInputs>({
    mode: 'onChange'
  });
  const { isDirty, isValid } = formState;

  useEffect(() => {
    setValue('loginWeb', true);
  }, []);

  const handleTabSelect = (tab: CustomEvent) => {
    setTabSecure(tab.detail.id === LoginOptionsEnum.SECURE_PASS);
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
    window.top.location.href = `${process.env.DOMAIN}${path}`;
  };

  const goOldPortal = () => {
    if (window.top) {
      window.top.location.href = 'https://www.bancodebogota.com/Banking/pb/logon?a=00010016&pbold=true';
    }
  };

  return (
    <div className={styles['login-web']} data-testid="login-web">
      <AuthBdbMlSecondtabs
        data-testid="login-tabs"
        position="center"
        proportionalWidth
        onMlTabsChanged={handleTabSelect}
        tabs={`[{"id":${LoginOptionsEnum.DEBIT_CARD},"title":"Tarjeta débito","disabled":false}, {"id":${LoginOptionsEnum.SECURE_PASS},"title":"Clave segura","disabled":false}]`}
      />
      <form noValidate onSubmit={handleSubmit(submitLogin)} data-testid="login-form">
        <div className={styles['login-web__form']}>
          <div className={styles['login-web__form__identification']}>
            <div className={styles['login-web__form__identification__type']}>
              <AuthBdbAtDropdown
                id="identificationType"
                name="identificationType"
                placeholder="Selecciona"
                data-testid="identification-type"
                isDesktop
                options={getList}
                defaultvalue={getList[0].value}
                onElementSelectedAtom={handleIdentificationTypeSelect}
              />
            </div>
            <div className={styles['login-web__form__identification__number']}>
              <AuthBdbAtInput
                data-testid="identification-number"
                {...inputIdentificationProps}
                placeholder="Número de documento"
                {...fieldRegistry(register('identificationNumber', { required: true }))}
              />
            </div>
          </div>
          {tabSecure && (
            <div className={styles['login-web__form__secure']}>
              <AuthBdbAtInput
                data-testid="key-secure"
                {...InputKeyProps.secure}
                label=""
                placeholder="Clave segura"
                {...fieldRegistry(register('password', { required: true, minLength: 4 }))}
              />
              <button
                className={`${styles['login-web__form__secure-forget']} bdb-at-btn bdb-at-btn--link bdb-at-btn--sm`}
                onClick={() => navigateSecureKey(false)}
                data-testid="forget-button-loginweb"
              >
                <label>Olvide mi clave</label>
              </button>
            </div>
          )}
          {!tabSecure && (
            <div className={styles['login-web__form__debit']}>
              <div className={styles['login-web__form__debit__password']}>
                <AuthBdbAtInput
                  data-testid="debit-key"
                  {...InputKeyProps.password}
                  label=""
                  placeholder="Clave de la Tarjeta Débito"
                  {...fieldRegistry(register('password', { required: !tabSecure, minLength: 4 }))}
                />
              </div>
              <div className={styles['login-web__form__debit__last-digits']}>
                <AuthBdbAtInput
                  data-testid="debit-digits"
                  {...InputKeyProps.last}
                  label=""
                  placeholder="4 últimos dígitos de la tarjeta"
                  {...fieldRegistry(register('lastDigitDebitCard', { required: !tabSecure, minLength: 4 }))}
                />
              </div>
            </div>
          )}

          <button
            data-testid="submit-button"
            className={`${styles['login-web__form__access']} bdb-at-btn bdb-at-btn--primary bdb-at-btn--lg`}
            disabled={!isDirty || !isValid}
            type="submit"
          >
            Ingresar ahora &#8250;
          </button>

          <div className={styles['login-web__form__error']}>
            <span className="sherpa-typography-caption-1">{loginWebErrorMessage}</span>
          </div>

          <div className={styles['login-web__form__actions']}>
            <button
              className={`${styles['login-web__form__actions__register']} bdb-at-btn bdb-at-btn--link bdb-at-btn--sm`}
              onClick={() => navigateSecureKey(true)}
              data-testid="register-button-loginweb"
            >
              <label>Registrarme &#8250;</label>
            </button>
            <button
              className={`${styles['login-web__form__actions__old-portal']} bdb-at-btn bdb-at-btn--link bdb-at-btn--sm`}
              onClick={goOldPortal}
              data-testid="old-portal-button"
            >
              <label>Ingresar al portal anterior &#8250;</label>
            </button>
          </div>

          <div className={`${styles['login-web__form__habeas']} sherpa-typography-overline-1`}>
            Este sitio está protegido por reCAPTCHA y aplican las{' '}
            <a href="https://policies.google.com/privacy" target="_blank">
              políticas de privacidad
            </a>{' '}
            y los{' '}
            <a href="https://policies.google.com/terms" target="_blank">
              términos de servicio de Google
            </a>
            .
          </div>
        </div>
        <span className={styles['login-web__version']}>{version}</span>
      </form>
    </div>
  );
};

export default LoginWeb;

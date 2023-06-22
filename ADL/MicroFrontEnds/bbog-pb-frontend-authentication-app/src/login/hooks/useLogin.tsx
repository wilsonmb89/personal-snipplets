import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BusinessErrorCodes, encrypt, loginSetup } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import { LoginCredentials, LoginResponse } from '@avaldigitallabs/bbog-pb-lib-frontend-commons/build/auth/login.model';
import { createLoaderState } from '@store/loader/loader.store';
import { LoginFormInputs } from '@login/components/login-form/LoginForm';
import { loginActions } from '@login/store/login.reducer';
import { getRecaptchaToken } from '@utils/recaptcha';
import { initialStateTerms } from '@store/user-features/user-features.entity';
import { fetchTermsAndConditionsApi } from '@store/user-features/user-features.api';
import showNotificationModal from '@components/core/modal-notification';
import showTermsAndConditionsModal from '@components/core/modal-terms';
import { termsAndConditionsVersion } from '@utils/termsAndConditions';

interface UseLogin {
  submitLogin: (values: LoginFormInputs) => void;
  saveDataOnSessionStorage: (response: LoginResponse) => void;
  validateTermsAndConditions: () => Promise<void>;
  loginWebErrorMessage: string;
}

export const useLogin = (): UseLogin => {
  // FIX: This state is temporary, while the development of the portal is finished
  const [loginWebErrorMessage, setLoginWebErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let termsAndConditions = initialStateTerms;
  let isLoginWeb = false;

  const submitLogin = async (values: LoginFormInputs) => {
    isLoginWeb = values.loginWeb;
    const credentials: LoginCredentials = {
      identificationNumber: values.identificationNumber,
      identificationType: values.identificationType,
      password: values.password,
      numberCard: values.lastDigitDebitCard
    };
    const setup = loginSetup({ host: process.env.API_URL, encryptBody: !['LOCAL', 'DEV'].includes(process.env.TAG) });

    dispatch(createLoaderState.actions.enable());
    const recaptchaToken = await getRecaptchaToken();
    try {
      const loginResponse = await setup.login(credentials, { recaptchaToken });
      console.log('TEST loginResponse:', JSON.stringify(loginResponse));
      saveDataOnSessionStorage(loginResponse);
      validateTermsAndConditions();
      dispatch(createLoaderState.actions.disable());
    } catch (error) {
      dispatch(createLoaderState.actions.disable());
      showErrorModal(credentials, error);
    }
  };

  const showErrorModal = (credentials: LoginCredentials, error) => {
    if (error.status === 409 && error.data.data.businessErrorCode === BusinessErrorCodes.Challenge) {
      const tokenCookie = error.data.data.customDetails.rsaRetryCorrelationId;
      dispatch(loginActions.setLoginRequest({ credentials, options: { tokenCookie } }));
      return navigateTokenValidation();
    }

    const { name, message } = error;
    if (isLoginWeb) {
      window.parent.postMessage({ title: name, description: message }, process.env.PORTAL_URL);
      setLoginWebErrorMessage(message);
    } else {
      const { type } = error;
      showNotificationModal({ type, name, message }, [{ text: 'Entendido' }]);
    }
  };

  const navigateTokenValidation = () => {
    if (isLoginWeb && window.top) {
      window.top.location.href = `${process.env.DOMAIN}/validacion-token`;
    } else {
      navigate('validacion-token');
    }
  };

  const validateTermsAndConditions = async () => {
    let isAccepted = false;
    const windowTop = window.top;
    try {
      termsAndConditions = await fetchTermsAndConditionsApi();
      Object.values(termsAndConditions).forEach(termsAndCondition => {
        isAccepted = termsAndCondition.version === termsAndConditionsVersion;
      });
      isAccepted ? navigateDashboard() : showTermsAndConditionsModal({ isLoginWeb, windowTop, termsAndConditions });
    } catch (error) {
      navigateDashboard();
    }
  };

  const navigateDashboard = () => {
    if (isLoginWeb && window.top) {
      window.top.location.href = `${process.env.DOMAIN}/dashboard`;
    } else {
      window.location.href = `${process.env.DOMAIN}/dashboard`;
    }
  };

  const saveDataOnSessionStorage = res => {
    sessionStorage.setItem(btoa('identificationType'), encrypt(res.identificationType));
    sessionStorage.setItem(btoa('identificationNumber'), encrypt(res.identificationNumber));
    sessionStorage.setItem(btoa('access-token'), encrypt(res.accessToken));
    sessionStorage.setItem(btoa('hasToken'), encrypt(res.hasActiveToken));
    sessionStorage.setItem(btoa('tokenVersion'), encrypt(res.tokenVersion));
    sessionStorage.setItem(btoa('idCryptAnalytic'), encrypt(res.identificationType + res.identificationNumber));
    sessionStorage.setItem(btoa('tokenBank'), encrypt(res.tokenBank));
    sessionStorage.setItem(btoa('uuid'), encrypt(res.uuid));
    sessionStorage.setItem(btoa('AuthState'), encrypt(res));
  };

  return { submitLogin, saveDataOnSessionStorage, validateTermsAndConditions, loginWebErrorMessage };
};

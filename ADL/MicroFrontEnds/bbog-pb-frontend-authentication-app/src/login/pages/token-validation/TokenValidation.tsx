import React, { useState } from 'react';
import styles from './TokenValidation.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BusinessErrorMessages, loginSetup } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import { AuthBdbMlBmToken } from '@utils/sherpa-tagged-components';
import { getLoginRequest } from '@login/store/login.select';
import { loginActions } from '@login/store/login.reducer';
import { createLoaderState } from '@store/loader/loader.store';
import { tokenConfirm, tokenModalDescription, tokenValidationExceeded } from '@login/constants/login-token-constants';
import { useLogin } from '@login/hooks/useLogin';
import { NotificationData } from '@components/core/modal-notification/ModalNotification';
import FormLayout from '@components/core/form-layout/FormLayout';
import showNotificationModal from '@components/core/modal-notification';

const TokenValidation = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saveDataOnSessionStorage, validateTermsAndConditions } = useLogin();
  const { credentials, options } = useSelector(getLoginRequest);
  const [hasError, setHasError] = useState(false);

  const sendTokenValidation = async (mobileToken: string) => {
    dispatch(createLoaderState.actions.enable());
    const setup = loginSetup({ host: process.env.API_URL, encryptBody: !['LOCAL', 'DEV'].includes(process.env.TAG) });
    try {
      const loginResponse = await setup.login(credentials, { ...options, mobileToken });
      dispatch(createLoaderState.actions.disable());
      showConfirmationToken(loginResponse);
    } catch (error) {
      dispatch(createLoaderState.actions.disable());
      validateError(error);
    }
  };

  const showConfirmationToken = loginResponse => {
    const servilineaModal: NotificationData = {
      type: tokenConfirm.type,
      name: tokenConfirm.name,
      message: (
        <>
          <div className="sherpa-typography-heading-2" style={{ marginBottom: '2.4rem' }}>
            {loginResponse.secureSiteKey}
          </div>
          <span className="sherpa-typography-body-1">{tokenConfirm.message}</span>
        </>
      )
    };
    showNotificationModal(servilineaModal, [
      {
        text: 'Verificar',
        action: async () => {
          dispatch(loginActions.clear());
          saveDataOnSessionStorage(loginResponse);
          await validateTermsAndConditions();
        }
      }
    ]);
  };

  const validateError = error => {
    setHasError(true);
    if (error.data.data.backendErrorMessage !== BusinessErrorMessages.InvalidToken) {
      showNotificationModal(tokenValidationExceeded, [{ text: 'Entendido', action: () => navigate('/') }]);
    }
  };

  return (
    <div className={styles['token-validation']}>
      <FormLayout title={'Ingreso a Banca Virtual'}>
        <div className={styles['token-validation__title']}>
          <span className="sherpa-typography-heading-6">Verifiquemos que seas tú</span>
        </div>

        <div className={styles['token-validation__token']}>
          <AuthBdbMlBmToken
            data-testid="token-form"
            headerTooltip={tokenModalDescription.title}
            description={tokenModalDescription.description}
            messageTooltip={tokenModalDescription.messageTooltip}
            isError={hasError}
            errorMsj={tokenModalDescription.errorMessage}
            onButtonClicked={event => sendTokenValidation(event.detail.code)}
          ></AuthBdbMlBmToken>
        </div>
      </FormLayout>
    </div>
  );
};

export default TokenValidation;

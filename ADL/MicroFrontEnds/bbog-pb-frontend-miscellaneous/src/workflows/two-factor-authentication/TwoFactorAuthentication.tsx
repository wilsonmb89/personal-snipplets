import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './TwoFactorAuthentication.module.scss';
import TwoAuthFactorLayout from './components/two-auth-factor-layout/TwoAuthFactorLayout';
import OTPFlow from './otp/components/OTPFlow';
import TokenFlow from './token/components/TokenFlow';
import { fetchSimValidation } from './otp/store/otp.effect';
import { otpActions } from './otp/store/otp.reducer';
import { tokenActions } from './token/store/token.reducer';
import { AppDispatch } from '@store/index';
import { getAllowedOTPByService } from '@store/user-features/user-features.select';
import { fetchUserSettings } from '@store/user-features/user-features.effect';
import { authStateSelector } from '@store/auth/auth.selector';
import { useNotification } from './hooks/useNotification.hook';

export interface TwoFactorAuthenticationProps {
  authData: AuthData;
  onSuccess: () => void;
  onError: () => void;
}

export interface AuthData {
  title: string;
  flow: string;
}

const TwoFactorAuthentication = ({ authData, onSuccess, onError }: TwoFactorAuthenticationProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { launchGenericError, launchOneActionNotification } = useNotification();

  const { flow, title } = authData;
  const { otpBySms, otpByCall } = useSelector(getAllowedOTPByService(flow));
  const { hasActiveToken, telephone } = useSelector(authStateSelector);

  const [step, setStep] = useState('token');

  useEffect(() => {
    if (otpBySms === null) {
      dispatch(fetchUserSettings()).catch(() => launchGenericError(onError));
    }
  }, []);

  const onOTPFlow = () => {
    if (otpBySms) {
      dispatch(fetchSimValidation())
        .then(() => setStep('otp'))
        .catch(launchNeedTokenNotification);
    }
  };

  const launchNeedTokenNotification = (): void => {
    launchOneActionNotification(
      {
        type: 'warning',
        name: 'Necesitas token',
        message:
          'Descarga la app de Banco de Bogotá, regístrate y activa tu token. Si cambiaste de número de celular o tienes token físico, vuelve a activarlo en un cajero.'
      },
      errorHandler
    );
  };

  const successHandler = () => {
    resetActions();
    onSuccess();
  };

  const errorHandler = () => {
    resetActions();
    onError();
  };

  const resetActions = (): void => {
    dispatch(otpActions.reset());
    dispatch(tokenActions.reset());
  };

  return (
    <TwoAuthFactorLayout headerTitle={title} onForwardBtnClicked={errorHandler} slot="content">
      <div className={`${styles['auth-content-container__title']} sherpa-typography-heading-6`}>
        Verifiquemos que eres tú
      </div>
      {step === 'token' && otpBySms !== null && (
        <TokenFlow
          otpBySms={otpBySms}
          hasActiveToken={hasActiveToken}
          secureContactNumber={telephone}
          onError={errorHandler}
          onSuccess={successHandler}
          onOTP={onOTPFlow}
        />
      )}
      {step === 'otp' && (
        <OTPFlow
          secureContactNumber={telephone}
          otpByCall={otpByCall}
          onError={errorHandler}
          onSuccess={successHandler}
        />
      )}
    </TwoAuthFactorLayout>
  );
};

export default TwoFactorAuthentication;

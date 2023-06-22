import React, { useEffect, useRef, useState } from 'react';
import styles from './OtpAuth.module.scss';
import FormLayout from '@components/core/form-layout/FormLayout';
import showNotificationModal from '@components/core/modal-notification';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthBdbMlBmToken } from '@utils/sherpa-tagged-components';
import { getFlowData, getRegisterBasicData } from '@secure-key/store/customer/customer.store';
import { OtpExceedAttempts } from '@secure-key/constants/secure-key-modal-messages';
import { useOtpValidation } from '@secure-key/hooks/useOtpValidation';

const OtpAuth = (): JSX.Element => {
  const navigate = useNavigate();
  const otpRef = useRef(null);
  const flowData = useSelector(getFlowData);
  const basicData = useSelector(getRegisterBasicData);
  const [otpCount, setOtpCount] = useState(0);
  const { validateOtp, resendCode, errorOtp } = useOtpValidation();
  const MAX_ATTEMPTS = 3;

  useEffect(() => {
    if (errorOtp) {
      if (otpRef.current.resetCode) {
        otpRef.current.resetCode();
      }
      setTimeout(() => {
        setOtpCount(otpCount + 1);
        if (otpCount === MAX_ATTEMPTS - 1) {
          showNotificationModal(OtpExceedAttempts, [{ text: 'Entendido', action: () => navigate('/') }]);
        }
      }, 100);
    }
  }, [errorOtp]);

  return (
    <div className={styles['otp-auth']} data-testid="otp-auth-page">
      <FormLayout title={flowData.title}>
        <div className={styles['otp-auth__title']}>
          <span className="sherpa-typography-heading-6">Verifiquemos que eres tú</span>
        </div>
        <div className={styles['otp-auth__otp']}>
          <AuthBdbMlBmToken
            ref={otpRef}
            data-testid="otp-auth"
            titleLabel="Código de verificación"
            description={`Ingresa el código de 6 dígitos enviado a tu celular terminado en (***)***.${basicData.phone}`}
            hiddenTooltip
            hiddenTimer={false}
            isError={errorOtp}
            errorMsj={`Código incorrecto, quedan ${MAX_ATTEMPTS - otpCount} intentos restantes.`}
            onButtonClicked={event => validateOtp(event.detail.code)}
            onSendCodeClicked={resendCode}
          />
        </div>
      </FormLayout>
    </div>
  );
};

export default OtpAuth;

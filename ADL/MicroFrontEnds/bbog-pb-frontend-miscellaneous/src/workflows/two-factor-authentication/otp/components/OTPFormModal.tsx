import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MiscellaneousBdbMlBmToken } from '../../../../constants/sherpaTaggedComponents';
import { fetchOTPValidation } from '../store/otp.effect';
import { hasCallOTPBeenSentSelector, otpAttemptErrorSelector } from '../store/otp.selector';
import { AppDispatch } from '@store/index';
import { useNotification } from '../../hooks/useNotification.hook';
export interface OTPFormModalProps {
  secureContactNumber: string;
  otpByCall: boolean;
  sendOtpCall: () => void;
  onClose: () => void;
}

const OTPFormModal = ({ secureContactNumber, otpByCall, sendOtpCall, onClose }: OTPFormModalProps): JSX.Element => {
  const OTP_TITLE_LABEL = 'Código de verificación';
  const OTP_DESCRIPTION = `Ingresa el código de 6 dígitos que se envió a tu celular terminado en (***)***${secureContactNumber.slice(
    -4
  )}`;

  const bdbMlBmOtpRef = useRef<HTMLBdbMlBmTokenElement>(null);
  const { launchGenericError } = useNotification();

  const dispatch: AppDispatch = useDispatch();

  const errorAttemptsMessage = useSelector(otpAttemptErrorSelector);
  const hasCallOTPBeenSent = useSelector(hasCallOTPBeenSentSelector);

  const [errorOTP, setErrorOTP] = useState<string>(null);

  useEffect(() => {
    if (bdbMlBmOtpRef?.current?.resetCode) {
      bdbMlBmOtpRef.current.resetCode();
    }
    setTimeout(() => {
      if (errorAttemptsMessage) {
        setErrorOTP(errorAttemptsMessage);
      }
    }, 100);
  }, [errorAttemptsMessage]);

  const validateOtpHandler = (event: CustomEvent) => {
    const {
      detail: { code: otpValue }
    } = event;
    if (otpValue) {
      dispatch(fetchOTPValidation(otpValue)).catch(() => launchGenericError(onClose));
    }
  };

  return (
    <MiscellaneousBdbMlBmToken
      data-testid="otp-form"
      titleLabel={OTP_TITLE_LABEL}
      description={OTP_DESCRIPTION}
      ref={bdbMlBmOtpRef}
      hiddenTooltip={true}
      hiddenTimer={!otpByCall || (otpByCall && hasCallOTPBeenSent)}
      isError={errorOTP !== null && errorOTP !== undefined}
      errorMsj={errorOTP || 'Campo requerido'}
      onButtonClicked={validateOtpHandler}
      onSendCodeClicked={sendOtpCall}
    />
  );
};

export default OTPFormModal;

import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as otpSelectors from '../store/otp.selector';
import OTPFormModal from './OTPFormModal';
import PhoneConfirmationModal from './PhoneConfirmationModal';
import { fetchGetOTP, fetchGetOTPFromCall } from '../store/otp.effect';
import { AppDispatch } from '@store/index';
import { useNotification } from '../../hooks/useNotification.hook';

export interface OTPFlowProps {
  secureContactNumber: string;
  otpByCall: boolean;
  onSuccess: () => void;
  onError: () => void;
}

const OTPFlow = ({ secureContactNumber, otpByCall, onSuccess, onError }: OTPFlowProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();

  const isOTPValid = useSelector(otpSelectors.isOTPValidSelector);
  const hasAttemptsLeft = useSelector(otpSelectors.hasAttemptsLeftSelector);
  const hasOTPBeenSent = useSelector(otpSelectors.hasOTPBeenSentSelector);
  const isSimValid = useSelector(otpSelectors.isSimValidSelector);

  const { launchOneActionNotification } = useNotification();

  useEffect(() => {
    if (isOTPValid) {
      onSuccess();
    }
  }, [isOTPValid]);

  useEffect(() => {
    if (!hasAttemptsLeft) {
      launchOneActionNotification(
        {
          type: 'error',
          name: 'Superaste la cantidad de ingresos de tu código de seguridad',
          message: 'No podemos continuar con el proceso. Intenta de nuevo más tarde.'
        },
        onError
      );
    }
  }, [hasAttemptsLeft]);

  useEffect(() => {
    if (isSimValid === false) {
      launchOneActionNotification(
        {
          type: 'warning',
          name: 'Necesitas Token',
          message:
            'Descarga la app de Banco de Bogotá, regístrate y activa tu token. Si cambiaste de número de celular o tienes token físico, vuelve a activarlo en un cajero.'
        },
        onError
      );
    }
  }, [isSimValid]);

  const sendOtpMessage = () => {
    dispatch(fetchGetOTP()).catch(() =>
      launchOneActionNotification(
        {
          type: 'error',
          name: 'No podemos enviarte el mensaje',
          message: (
            <Fragment>
              En este momento tu operador de telefonía no nos permite enviarte el mensaje de texto.
              <br />
              <br />
              Por favor intenta de nuevo en 30 minutos.
            </Fragment>
          )
        },
        onError
      )
    );
  };

  const sendOtpCall = () => {
    dispatch(fetchGetOTPFromCall()).catch(() =>
      launchOneActionNotification(
        {
          type: 'error',
          name: 'Error en envío por llamada',
          message: 'En estos momentos tu operador de telefonía no nos permite realizar la llamada.'
        },
        onError
      )
    );
  };

  return (
    <Fragment>
      {!hasOTPBeenSent && isSimValid && (
        <PhoneConfirmationModal secureContactNumber={secureContactNumber} onConfirm={sendOtpMessage} />
      )}
      {hasAttemptsLeft && hasOTPBeenSent && (
        <OTPFormModal
          secureContactNumber={secureContactNumber}
          otpByCall={otpByCall}
          sendOtpCall={sendOtpCall}
          onClose={onError}
        />
      )}
    </Fragment>
  );
};

export default OTPFlow;

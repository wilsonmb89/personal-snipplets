import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNotification } from '../../hooks/useNotification.hook';

import * as tokenSelectors from '../store/token.selector';
import TokenFormModal from './TokenFormModal';

export interface TokenFlowProps {
  otpBySms: boolean;
  hasActiveToken: boolean;
  secureContactNumber?: string;
  onSuccess: () => void;
  onError: () => void;
  onOTP: () => void;
}

const TokenFlow = ({
  otpBySms,
  hasActiveToken,
  secureContactNumber,
  onSuccess,
  onError,
  onOTP
}: TokenFlowProps): JSX.Element => {
  const isTokenValid = useSelector(tokenSelectors.isTokenValidSelector);
  const hasAttemptsLeft = useSelector(tokenSelectors.hasAttemptsLeftSelector);

  const { launchOneActionNotification } = useNotification();

  useEffect(() => {
    if (isTokenValid) {
      onSuccess();
    }
  }, [isTokenValid]);

  useEffect(() => {
    if (
      (hasActiveToken === false && !otpBySms) ||
      ((hasActiveToken === false || !hasAttemptsLeft) && otpBySms && !secureContactNumber)
    ) {
      launchOneActionNotification(
        {
          type: 'warning',
          name: 'Necesitas Token',
          message:
            'Descarga la app de Banco de Bogotá, regístrate y activa tu token. Si cambiaste de número de celular o tienes token físico, vuelve a activarlo en un cajero.'
        },
        onError
      );
    } else if (hasActiveToken === false && secureContactNumber && otpBySms) {
      setTimeout(onOTP, 1);
    } else if (!hasAttemptsLeft && !otpBySms) {
      launchOneActionNotification(
        {
          type: 'warning',
          name: 'Has superado el límite de intentos',
          message: 'Por favor intentalo nuevamente más tarde.'
        },
        onError
      );
    } else if (secureContactNumber && !hasAttemptsLeft && otpBySms) {
      launchOneActionNotification(
        {
          type: 'warning',
          name: 'Error con tu Token',
          message:
            'Hemos identificado un problema con tu Token, por eso habilitamos que puedas completar este proceso con un código de verificación.'
        },
        () => setTimeout(onOTP, 1),
        'Continuar'
      );
    }
  }, [hasAttemptsLeft, secureContactNumber, hasActiveToken, otpBySms]);

  return <TokenFormModal onClose={onError} />;
};

export default TokenFlow;

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MiscellaneousBdbMlBmToken } from '../../../../constants/sherpaTaggedComponents';
import { fetchTokenValidation } from '../store/token.effect';
import { tokenAttemptErrorSelector } from '../store/token.selector';
import { AppDispatch } from '@store/index';
import { useNotification } from '../../hooks/useNotification.hook';
import { useState } from 'react';

export interface TokenFormModalProps {
  onClose: () => void;
}

const TokenFormModal = ({ onClose }: TokenFormModalProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const bdbMlBmTokenRef = useRef<HTMLBdbMlBmTokenElement>(null);

  const errorAttempts = useSelector(tokenAttemptErrorSelector);

  const { launchGenericError } = useNotification();

  const [errorToken, setErrorToken] = useState<string>(null);

  useEffect(() => {
    if (bdbMlBmTokenRef?.current?.resetCode) {
      bdbMlBmTokenRef.current.resetCode();
    }
    setTimeout(() => {
      if (errorAttempts) {
        setErrorToken(errorAttempts);
      }
    }, 100);
  }, [errorAttempts]);

  const HEADER_TOOLTIP = '¿Dónde lo encuentro?';
  const MESSAGE_TOOLTIP =
    'Ingresa a tu banca móvil, en la parte superior derecha encontrarás la opción de token, si no te has registrado sigue los pasos.';

  const validateTokenHandler = (event: CustomEvent) => {
    const {
      detail: { code: tokenValue }
    } = event;
    if (tokenValue) {
      dispatch(fetchTokenValidation(tokenValue)).catch(() => launchGenericError(onClose));
    }
  };

  return (
    <MiscellaneousBdbMlBmToken
      data-testid="token-form"
      ref={bdbMlBmTokenRef}
      headerTooltip={HEADER_TOOLTIP}
      messageTooltip={MESSAGE_TOOLTIP}
      hiddenTimer={true}
      isError={errorToken && errorToken.length > 0}
      errorMsj={errorToken || 'Campo requerido'}
      onButtonClicked={validateTokenHandler}
    />
  );
};

export default TokenFormModal;

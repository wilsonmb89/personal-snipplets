import { NotificationData } from '@components/core/modal-notification/ModalNotification';

export const tokenValidationExceeded: NotificationData = {
  type: 'error',
  name: 'Superaste la cantidad de ingresos con tu token',
  message: 'Por tu seguridad no puedes continuar con el proceso, inténtalo más tarde.'
};

export const tokenConfirm: NotificationData = {
  type: 'information',
  name: 'Este es tu número de sitio seguro',
  message: 'Este número debe coincidir con el que aparece en tu token físico o token móvil en tu celular.'
};

export const tokenModalDescription = {
  title: '¿Dónde lo encuentro?',
  description: 'Para realizar este proceso, ingresa el código de Token móvil o físico.',
  messageTooltip:
    'Ingresa a tu banca móvil, en la parte superior derecha encontrarás la opción de token, si no te has registrado sigue los pasos.',
  errorMessage: 'Token incorrecto. Verifica e ingrésalo nuevamente.'
};

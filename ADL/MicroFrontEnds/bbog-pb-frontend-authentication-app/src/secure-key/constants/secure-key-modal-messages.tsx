import React from 'react';
import { NotificationData } from '@components/core/modal-notification/ModalNotification';
import { secureKeyPageData } from './secure-key-constants';

export const userValidationError = {
  notCustomer: {
    type: 'warning',
    name: 'Revisa los datos ingresados',
    message: 'Verifica que tu número de identificación esté bien escrito e inténtalo de nuevo.'
  } as NotificationData,
  hasSecureKey: {
    type: 'warning',
    name: 'Ya cuentas con una Clave segura',
    message: (
      <>
        Por favor ingrésala a continuación con tu tipo y número de identificación. Si no la recuerdas ingresa en{' '}
        <a
          className="sherpa-typography-interactive-2"
          style={{ textDecoration: 'none' }}
          href={`${process.env.DOMAIN}${secureKeyPageData.forget.userValidationPath}`}
        >
          Olvidé mi clave
        </a>
        .
      </>
    )
  } as NotificationData,
  withoutSecureKey: {
    type: 'warning',
    name: 'Aún no cuentas con una Clave segura',
    message: (
      <>
        Para crear una ingresa en{' '}
        <a
          className="sherpa-typography-interactive-2"
          style={{ textDecoration: 'none' }}
          href={`${process.env.DOMAIN}${secureKeyPageData.register.userValidationPath}`}
        >
          Registrarme
        </a>
        .
      </>
    )
  } as NotificationData,
  noActiveProducts: {
    type: 'warning',
    name: 'No tienes productos activos',
    message:
      'Por favor verifica el estado de tus productos, comunícate a la Servilínea o acércate a una de nuestras oficinas.'
  } as NotificationData,
  withoutSecureData: {
    type: 'warning',
    name: 'No tienes datos seguros registrados',
    message:
      'Para continuar con este proceso, por favor acércate a una oficina a registrar tu número de celular y correo electrónico como datos de acceso a canales virtuales.'
  } as NotificationData
};

export const notNumberData: NotificationData = {
  type: 'information',
  name: '¿No es tu número de celular?',
  message: (
    <>
      <p>Si el número no corresponde a tu celular actual, acércate a una de nuestras oficinas y actualiza tus datos.</p>
      <p>
        Revisa los horarios y a{' '}
        <a
          className="sherpa-typography-interactive-2"
          href="https://www.bancodebogota.com/BuscadordePuntosBogota/?entidad=bogota"
        >
          puntos de atención
        </a>{' '}
        en www.bancodebogota.com
      </p>
    </>
  )
};

export const OtpExceedAttempts: NotificationData = {
  type: 'error',
  name: 'Superaste la cantidad de ingresos de tu código de seguridad',
  message: 'No podemos continuar con el proceso. Intenta de nuevo más tarde.'
};

export const productValidationErrors = {
  debitNotExists: {
    type: 'warning',
    name: 'Tu tarjeta débito no existe',
    message: 'Revisa la información e intenta nuevamente.',
    status: -1
  } as NotificationData,
  productExceedAttemptsTD: {
    type: 'error',
    name: 'Producto bloqueado',
    message: (
      <>
        <p>Por tu seguridad, tu producto ha sido bloqueado y no podemos continuar con el proceso de olvido de clave.</p>
        <p>Por favor comunícate a nuestra Servilínea o acércate a una de nuestras oficinas.</p>
      </>
    )
  } as NotificationData,
  productExceedAttemptsProducts: {
    type: 'error',
    name: 'Superaste el límite de intentos fallidos',
    message: 'Revisa la información de tu producto e inténtalo nuevamente más tarde.'
  } as NotificationData
};

export const newKeyCreatedModal: NotificationData = {
  type: 'success',
  name: '¡Felicitaciones!',
  message: 'Tu nueva clave segura ha sido creada con éxito.'
};

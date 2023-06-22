import React from 'react';
import { act, render, screen, waitFor, createEvent } from '@test-utils/provider-mock';
import '@testing-library/jest-dom';
import server, { getUserSettingsResponse } from '@test-utils/api-mock';
import TwoFactorAuthentication, { AuthData } from '../TwoFactorAuthentication';
import store from '@store/index';
import { rest } from 'msw';
import { encrypt } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';

describe('Token', () => {
  const OLD_ENV = process.env;
  const authData: AuthData = {
    title: 'Flow Test',
    flow: 'paymentsGatewayExecutePayment'
  };

  const onSuccess = jest.fn();
  const onError = jest.fn();

  const typeToken = async () => {
    const tokenElement = (await waitFor(() => screen.getByTestId('token-form'))) as HTMLBdbMlBmTokenElement;
    const event: Event & { detail?: unknown } = createEvent('buttonClicked', tokenElement);
    event.detail = { code: '123456' };
    tokenElement.dispatchEvent(event);
  };

  beforeAll(() => {
    sessionStorage.setItem(
      btoa('AuthState'),
      encrypt({
        accessToken: 'test access token',
        hasActiveToken: true
      })
    );
    server.listen();
  });

  afterEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should validate token successfuly', async () => {
    act(() => {
      render(<TwoFactorAuthentication authData={authData} onSuccess={onSuccess} onError={onError} />);
    });
    await waitFor(() => screen.getByTestId('token-form'));
    typeToken();
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  test('should retry 3 times if token is wrong', async () => {
    const responseBody = {
      originComponent: 'authentication',
      backendErrorMessage: 'Clave segura bloqueada',
      businessErrorCode: '1880',
      serverStatusCode: '409',
      errorMessage:
        'There was a business error processing this request, as follows : Adapter response references Business Error with code 1880, serverStatusCode 409 and description: bdb:IdentityValidationService, with details: Clave segura bloqueada Clave segura bloqueada {"name":"bdb:IdentityValidationService","statusCode":409,"businessErrorCode":"1880","businessErrorMessage":"Clave segura bloqueada","serverStatusDesc":"Clave segura bloqueada"}.',
      customerErrorMessage: {
        title: 'Transacción Fallida',
        message: 'En estos momentos no es posible procesar la transacción. Por favor inténtalo más tarde',
        alertType: 'AlertsMessagesType.GENERIC_WARNING'
      }
    };
    server.use(
      rest.post('/api-gateway/validation/validate-otp', (req, res, ctx) => {
        return res(ctx.status(409), ctx.json(responseBody));
      })
    );
    act(() => {
      render(<TwoFactorAuthentication authData={authData} onSuccess={onSuccess} onError={onError} />);
    });
    const tokenElement = (await waitFor(() => screen.getByTestId('token-form'))) as HTMLBdbMlBmTokenElement;
    const event: Event & { detail?: unknown } = createEvent('buttonClicked', tokenElement);
    event.detail = { code: '123456' };

    tokenElement.dispatchEvent(event);
    await waitFor(() => expect(tokenElement.errorMsj).toBe('Código incorrecto, te quedan 2 intentos'));

    tokenElement.dispatchEvent(event);
    await waitFor(() => expect(tokenElement.errorMsj).toBe('Código incorrecto, te queda 1 intento'));

    tokenElement.dispatchEvent(event);
    const modalLimits = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    expect(modalLimits.titleModal).toBe('Has superado el límite de intentos');

    const modalEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalLimits);
    modalEvent.detail = { value: 'Entendido' };
    modalLimits.dispatchEvent(modalEvent);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  test('should show activation modal if user does not have an active token and the flow does not allow sms otp message', async () => {
    sessionStorage.setItem(
      btoa('AuthState'),
      encrypt({
        accessToken: 'test access token',
        hasActiveToken: false
      })
    );
    act(() => {
      render(<TwoFactorAuthentication authData={authData} onSuccess={onSuccess} onError={onError} />);
    });
    await waitFor(() => screen.getByTestId('token-form'));

    const modalLimits = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    expect(modalLimits.titleModal).toBe('Necesitas Token');

    const modalEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalLimits);
    modalEvent.detail = { value: 'Entendido' };
    modalLimits.dispatchEvent(modalEvent);

    expect(onError).toHaveBeenCalledTimes(1);
  });

  test('should show activation modal if user does not have a secure contact number', async () => {
    server.use(
      rest.post('/api-gateway/user-features/get-user-settings', (req, res, ctx) =>
        res(
          ctx.json({
            ...getUserSettingsResponse,
            toggle: { allowedServicesV2: { paymentsGatewayExecutePayment: { otpByCall: false, otpBySms: true } } }
          })
        )
      )
    );
    sessionStorage.setItem(
      btoa('AuthState'),
      encrypt({
        accessToken: 'test access token',
        hasActiveToken: false
      })
    );
    act(() => {
      render(<TwoFactorAuthentication authData={authData} onSuccess={onSuccess} onError={onError} />);
    });
    await waitFor(() => screen.getByTestId('token-form'));

    const modalLimits = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    expect(modalLimits.titleModal).toBe('Necesitas Token');

    const modalEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalLimits);
    modalEvent.detail = { value: 'Entendido' };
    modalLimits.dispatchEvent(modalEvent);

    expect(onError).toHaveBeenCalledTimes(1);
  });

  test('should show activation modal if user does not have a secure contact number', async () => {
    sessionStorage.setItem(
      btoa('AuthState'),
      encrypt({
        accessToken: 'test access token',
        hasActiveToken: true,
        telephone: '3102223344'
      })
    );
    const responseBody = {
      originComponent: 'authentication',
      backendErrorMessage: 'Clave segura bloqueada',
      businessErrorCode: '1880',
      serverStatusCode: '409',
      errorMessage:
        'There was a business error processing this request, as follows : Adapter response references Business Error with code 1880, serverStatusCode 409 and description: bdb:IdentityValidationService, with details: Clave segura bloqueada Clave segura bloqueada {"name":"bdb:IdentityValidationService","statusCode":409,"businessErrorCode":"1880","businessErrorMessage":"Clave segura bloqueada","serverStatusDesc":"Clave segura bloqueada"}.',
      customerErrorMessage: {
        title: 'Transacción Fallida',
        message: 'En estos momentos no es posible procesar la transacción. Por favor inténtalo más tarde',
        alertType: 'AlertsMessagesType.GENERIC_WARNING'
      }
    };
    server.use(
      rest.post('/api-gateway/validation/validate-otp', (req, res, ctx) => {
        return res(ctx.status(409), ctx.json(responseBody));
      })
    );
    act(() => {
      render(
        <TwoFactorAuthentication
          authData={{ title: 'Test Flow', flow: 'accountInscription' }}
          onSuccess={onSuccess}
          onError={onError}
        />
      );
    });
    const tokenElement = (await waitFor(() => screen.getByTestId('token-form'))) as HTMLBdbMlBmTokenElement;
    const event: Event & { detail?: unknown } = createEvent('buttonClicked', tokenElement);
    event.detail = { code: '123456' };

    tokenElement.dispatchEvent(event);
    await waitFor(() => expect(tokenElement.errorMsj).toBe('Código incorrecto, te quedan 2 intentos'));

    tokenElement.dispatchEvent(event);
    await waitFor(() => expect(tokenElement.errorMsj).toBe('Código incorrecto, te queda 1 intento'));

    tokenElement.dispatchEvent(event);
    const modalLimits = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    expect(modalLimits.titleModal).toBe('Error con tu Token');
    const messageInfo = screen.findByText(
      'Hemos identificado un problema con tu Token, por eso habilitamos que puedas completar este proceso con un código de verificación.'
    );
    expect(messageInfo).toBeTruthy();

    const modalEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalLimits);
    modalEvent.detail = { value: 'Continuar' };
    modalLimits.dispatchEvent(modalEvent);
  });

  test('should show activation modal if user does not have an active token and the flow does not allow sms otp message', async () => {
    sessionStorage.setItem(
      btoa('AuthState'),
      encrypt({
        accessToken: 'test access token',
        hasActiveToken: false,
        telephone: '3102223344'
      })
    );
    act(() => {
      render(
        <TwoFactorAuthentication
          authData={{
            title: 'Flow Test',
            flow: 'accountInscription'
          }}
          onSuccess={onSuccess}
          onError={onError}
        />
      );
    });
    await waitFor(() => screen.getByTestId('token-form'));

    const modalLimits = (await waitFor(() => screen.getByTestId('otp-confirm-form'))) as HTMLBdbMlBmOtpElement;
    expect(modalLimits.telNumber).toBe('3344');

    const modalEvent: Event & { detail?: unknown } = createEvent('buttonClicked', modalLimits);
    modalLimits.dispatchEvent(modalEvent);

    const otpForm = (await waitFor(() => screen.getByTestId('otp-form'))) as HTMLBdbMlBmOtpElement;
    expect(otpForm).toBeInTheDocument();
  });
});

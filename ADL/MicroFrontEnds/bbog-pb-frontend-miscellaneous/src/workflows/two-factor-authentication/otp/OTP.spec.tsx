import React from 'react';
import { rest } from 'msw';
import '@testing-library/jest-dom';

import TwoFactorAuthentication, { AuthData } from '../TwoFactorAuthentication';
import server from '@test-utils/api-mock';
import store from '@store/index';
import { act, render, screen, waitFor } from '@test-utils/provider-mock';
import { createEvent } from '@testing-library/react';
import { encrypt } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';

describe('OTP', () => {
  const OLD_ENV = process.env;
  const authData: AuthData = {
    title: 'Flow Test',
    flow: 'accountInscription'
  };

  const onSuccess = jest.fn();
  const onError = jest.fn();

  beforeAll(() => {
    sessionStorage.setItem(
      btoa('AuthState'),
      encrypt({
        accessToken: 'test access token',
        hasActiveToken: false,
        traceability: 'mocked trazability code',
        telephone: '3001234567'
      })
    );
    process.env = { ...OLD_ENV, API_URL: '/api-gateway', TAG: 'DEV' };
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should show not your number modal if user clicks on cta', async () => {
    act(() => {
      render(<TwoFactorAuthentication authData={authData} onSuccess={onSuccess} onError={onError} />);
    });
    const otpConfirmForm = (await waitFor(() => screen.getByTestId('otp-confirm-form'))) as HTMLBdbMlBmOtpElement;
    const otpConfirmFormEvent: Event & { detail?: unknown } = createEvent('secondButtonClicked', otpConfirmForm);
    otpConfirmForm.dispatchEvent(otpConfirmFormEvent);

    const wrongNumberModal = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    expect(wrongNumberModal.titleModal).toBe('¿No es tu número de celular?');

    const otpFlowModal = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    const wrongNumberModalEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', otpFlowModal);
    wrongNumberModalEvent.detail = { value: 'Entendido' };
    wrongNumberModal.dispatchEvent(wrongNumberModalEvent);

    const headerElement = (await waitFor(() => screen.getByTestId('header'))) as HTMLBdbMlHeaderBvElement;
    const headerElementEvent: Event & { detail?: unknown } = createEvent('forwardBtnClicked', headerElement);
    headerElement.dispatchEvent(headerElementEvent);

    expect(onError).toHaveBeenCalledTimes(1);
  });

  test('should show show offices button in not your number modal', async () => {
    act(() => {
      render(<TwoFactorAuthentication authData={authData} onSuccess={onSuccess} onError={onError} />);
    });
    const otpConfirmForm = (await waitFor(() => screen.getByTestId('otp-confirm-form'))) as HTMLBdbMlBmOtpElement;
    const otpConfirmFormEvent: Event & { detail?: unknown } = createEvent('secondButtonClicked', otpConfirmForm);
    otpConfirmForm.dispatchEvent(otpConfirmFormEvent);

    const wrongNumberModal = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    expect(wrongNumberModal.titleModal).toBe('¿No es tu número de celular?');

    const otpFlowModal = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    const wrongNumberModalEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', otpFlowModal);
    wrongNumberModalEvent.detail = { value: 'Ver oficinas' };
    wrongNumberModal.dispatchEvent(wrongNumberModalEvent);

    const headerElement = (await waitFor(() => screen.getByTestId('header'))) as HTMLBdbMlHeaderBvElement;
    const headerElementEvent: Event & { detail?: unknown } = createEvent('forwardBtnClicked', headerElement);
    headerElement.dispatchEvent(headerElementEvent);

    expect(onError).toHaveBeenCalledTimes(1);
  });

  test('should validate otp by sms successfuly', async () => {
    act(() => {
      render(<TwoFactorAuthentication authData={authData} onSuccess={onSuccess} onError={onError} />);
    });

    const otpConfirmForm = (await waitFor(() => screen.getByTestId('otp-confirm-form'))) as HTMLBdbMlBmOtpElement;
    const otpConfirmFormEvent: Event & { detail?: unknown } = createEvent('buttonClicked', otpConfirmForm);
    otpConfirmForm.dispatchEvent(otpConfirmFormEvent);

    const tokenElement = (await waitFor(() => screen.getByTestId('otp-form'))) as HTMLBdbMlBmTokenElement;
    const event: Event & { detail?: unknown } = createEvent('buttonClicked', tokenElement);
    event.detail = { code: '123456' };
    tokenElement.dispatchEvent(event);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  test('should send OTP code from call', async () => {
    act(() => {
      render(<TwoFactorAuthentication authData={authData} onSuccess={onSuccess} onError={onError} />);
    });

    const otpConfirmForm = (await waitFor(() => screen.getByTestId('otp-confirm-form'))) as HTMLBdbMlBmOtpElement;
    const otpConfirmFormEvent: Event & { detail?: unknown } = createEvent('buttonClicked', otpConfirmForm);
    otpConfirmForm.dispatchEvent(otpConfirmFormEvent);

    const tokenElement = (await waitFor(() => screen.getByTestId('otp-form'))) as HTMLBdbMlBmTokenElement;

    const event: Event & { detail?: unknown } = createEvent('sendCodeClicked', tokenElement);
    tokenElement.dispatchEvent(event);
    await waitFor(() => expect(tokenElement.hiddenTimer).toBeFalsy());

    const buttonClickedEvent: Event & { detail?: unknown } = createEvent('buttonClicked', tokenElement);
    buttonClickedEvent.detail = { code: '123456' };
    tokenElement.dispatchEvent(buttonClickedEvent);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  test('should retry 3 times if otp is wrong', async () => {
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

    const otpConfirmForm = (await waitFor(() => screen.getByTestId('otp-confirm-form'))) as HTMLBdbMlBmOtpElement;
    const otpConfirmFormEvent: Event & { detail?: unknown } = createEvent('buttonClicked', otpConfirmForm);
    otpConfirmForm.dispatchEvent(otpConfirmFormEvent);

    const tokenElement = (await waitFor(() => screen.getByTestId('otp-form'))) as HTMLBdbMlBmTokenElement;
    const event: Event & { detail?: unknown } = createEvent('buttonClicked', tokenElement);
    event.detail = { code: '123456' };
    tokenElement.dispatchEvent(event);
    await waitFor(() => expect(tokenElement.errorMsj).toBe('Código incorrecto, te quedan 2 intentos'));

    tokenElement.dispatchEvent(event);
    await waitFor(() => expect(tokenElement.errorMsj).toBe('Código incorrecto, te queda 1 intento'));

    tokenElement.dispatchEvent(event);
    const modalLimits = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    expect(modalLimits.titleModal).toBe('Superaste la cantidad de ingresos de tu código de seguridad');
    const messageInfo = screen.findByText('No podemos continuar con el proceso. Intenta de nuevo más tarde.');
    expect(messageInfo).toBeTruthy();

    const modalLimitsEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalLimits);
    modalLimitsEvent.detail = { value: 'Entendido' };
    modalLimits.dispatchEvent(modalLimitsEvent);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  test('should show token activation modal if sim is invalid', async () => {
    server.use(
      rest.post('/api-gateway/validation/validate-sim', (req, res, ctx) =>
        res(ctx.json({ phoneNumber: '3551', provider: 'Claro', isSecure: true, isValid: false }))
      )
    );
    act(() => {
      render(<TwoFactorAuthentication authData={authData} onSuccess={onSuccess} onError={onError} />);
    });

    const modalTokenNeed = (await waitFor(() => screen.getByTestId('notification-modal'))) as HTMLBdbMlModalElement;
    expect(modalTokenNeed.titleModal).toBe('Necesitas Token');

    const modalTokenNeedEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalTokenNeed);
    modalTokenNeedEvent.detail = { value: 'Entendido' };
    modalTokenNeed.dispatchEvent(modalTokenNeedEvent);

    expect(onError).toHaveBeenCalledTimes(1);
  });
});

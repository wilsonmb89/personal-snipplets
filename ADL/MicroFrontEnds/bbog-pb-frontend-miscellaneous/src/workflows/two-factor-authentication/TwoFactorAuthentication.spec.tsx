import React from 'react';
import '@testing-library/jest-dom';

import TwoFactorAuthentication, { AuthData } from './TwoFactorAuthentication';
import { encrypt } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import { act, render, waitFor, screen, createEvent } from '@test-utils/provider-mock';
import { userSettingsActions } from '@store/user-features/user-features.reducer';
import server, { getUserSettingsResponse } from '@test-utils/api-mock';
import store from '@store/index';
import validateTwoFactorAuthentication from '@2fa';

describe('TwoFactorAuthentication component unit tests', () => {
  const OLD_ENV = process.env;
  const authData: AuthData = {
    title: 'Flow Test',
    flow: 'accountInscription'
  };

  const onSuccess = jest.fn();
  const onError = jest.fn();

  beforeAll(() => {
    store.dispatch(userSettingsActions.fetchUserSettingsSuccess(getUserSettingsResponse));
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

  test('should load the component successfully with token flow', async () => {
    sessionStorage.setItem(
      btoa('AuthState'),
      encrypt({
        accessToken: 'test access token',
        hasActiveToken: true,
        traceability: 'mocked trazability code',
        telephone: '3001234567'
      })
    );
    act(() => {
      render(<TwoFactorAuthentication authData={authData} onSuccess={onSuccess} onError={onError} />);
    });
    const element = await waitFor(() => screen.getByTestId('two-auth-factor-layout'));
    expect(element).toBeInTheDocument();

    const tokenForm = await waitFor(() => screen.getByTestId('token-form'));
    expect(tokenForm).toBeInTheDocument();
    const event: Event & { detail?: unknown } = createEvent('buttonClicked', tokenForm);
    event.detail = { code: '123456' };
    tokenForm.dispatchEvent(event);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  test('should load the component successfully with OTP flow', async () => {
    sessionStorage.setItem(
      btoa('AuthState'),
      encrypt({
        accessToken: 'test access OTP',
        hasActiveToken: false,
        traceability: 'mocked trazability code',
        telephone: '3001234567'
      })
    );
    act(() => {
      render(<TwoFactorAuthentication authData={authData} onSuccess={onSuccess} onError={onError} />);
    });
    const element = await waitFor(() => screen.getByTestId('two-auth-factor-layout'));
    expect(element).toBeInTheDocument();

    const otpConfirmForm = (await waitFor(() => screen.getByTestId('otp-confirm-form'))) as HTMLBdbMlBmOtpElement;
    const otpConfirmFormEvent: Event & { detail?: unknown } = createEvent('buttonClicked', otpConfirmForm);
    otpConfirmForm.dispatchEvent(otpConfirmFormEvent);

    const tokenElement = (await waitFor(() => screen.getByTestId('otp-form'))) as HTMLBdbMlBmTokenElement;
    const event: Event & { detail?: unknown } = createEvent('buttonClicked', tokenElement);
    event.detail = { code: '123456' };
    tokenElement.dispatchEvent(event);
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  test('should load the compoment sucessfully from promise', async () => {
    sessionStorage.setItem(
      btoa('AuthState'),
      encrypt({
        accessToken: 'test access token',
        hasActiveToken: true,
        traceability: 'mocked trazability code',
        telephone: '3001234567'
      })
    );
    validateTwoFactorAuthentication(authData);
    const element = await waitFor(() => screen.getByTestId('two-auth-factor-layout'));
    expect(element).toBeInTheDocument();

    const tokenForm = await waitFor(() => screen.getByTestId('token-form'));
    expect(tokenForm).toBeInTheDocument();
    const event: Event & { detail?: unknown } = createEvent('buttonClicked', tokenForm);
    event.detail = { code: '123456' };
    tokenForm.dispatchEvent(event);

    await waitFor(() => expect(element).toBeInTheDocument());
  });
});

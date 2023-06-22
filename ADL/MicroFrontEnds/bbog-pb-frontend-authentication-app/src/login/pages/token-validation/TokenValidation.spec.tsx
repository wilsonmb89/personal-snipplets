import React from 'react';
import '@testing-library/jest-dom';
import store from '@store/index';
import server, { authChallengeResponse, login } from '@test-utils/api-mock';
import { render, waitFor, screen, createEvent, act, fireEvent } from '@test-utils/provider-mock';
import TokenValidation from './TokenValidation';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

jest.mock('@avaldigitallabs/bbog-pb-lib-frontend-commons', () => ({
  loginSetup: jest.fn().mockImplementation(() => ({ login })),
  decrypt: jest.fn().mockImplementation(() => 'encypt'),
  encrypt: jest.fn().mockImplementation(() => 'descrypt'),
  BusinessErrorMessages: { InvalidToken: 'Validacion de Token No Exitosa' }
}));

describe('TokenValidation', () => {
  const OLD_ENV = process.env;
  const mockSetState = jest.spyOn(React, 'useState');
  const assignMock = jest.fn();

  beforeAll(() => {
    delete window.location;
    window.location = { assign: assignMock as unknown } as Location;
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
    jest.resetModules();
  });

  afterEach(() => {
    sessionStorage.clear();
    server.resetHandlers();
    assignMock.mockClear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should render TokenValidation component', () => {
    const tokenValidation = render(<TokenValidation />);
    expect(tokenValidation).toBeTruthy();
  });

  test('should send login with token', async () => {
    await act(async () => {
      render(<TokenValidation />);
      await waitFor(() => screen.getByTestId('token-form'));
    });
    await act(async () => {
      const tokenInput = screen.getByTestId('token-form') as HTMLBdbMlBmTokenElement;
      const submitTokenEvent: Event & { detail?: unknown } = createEvent('buttonClicked', tokenInput);
      submitTokenEvent.detail = { code: '123456' };
      tokenInput.dispatchEvent(submitTokenEvent);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Verificar' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
    expect(login).toBeCalled();
  });

  test('should send login error with token', async () => {
    login.mockImplementationOnce(() => Promise.reject({ data: authChallengeResponse }));
    await act(async () => {
      render(<TokenValidation />);
      const tokenInput = screen.getByTestId('token-form') as HTMLBdbMlBmTokenElement;
      const submitTokenEvent: Event & { detail?: unknown } = createEvent('buttonClicked', tokenInput);
      submitTokenEvent.detail = { code: '123456' };
      tokenInput.dispatchEvent(submitTokenEvent);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
    expect(mockSetState).toBeCalled();
  });
});

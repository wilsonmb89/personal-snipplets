import React from 'react';
import '@testing-library/jest-dom';
import server, { authChallengeResponse, login } from '@test-utils/api-mock';
import sherpaEvent from '@test-utils/sherpa-event';
import store from '@store/index';
import LoginWeb from './LoginWeb';
import { render, waitFor, screen, createEvent, act, fireEvent } from '@test-utils/provider-mock';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedUseNavigate
}));

jest.mock('@utils/recaptcha', () => ({
  getRecaptchaToken: jest.fn(() => Promise.resolve('token'))
}));

jest.mock('@avaldigitallabs/bbog-pb-lib-frontend-commons', () => ({
  loginSetup: jest.fn().mockImplementation(() => ({ login })),
  decrypt: jest.fn().mockImplementation(() => 'encypt'),
  encrypt: jest.fn().mockImplementation(() => 'decrypt'),
  BusinessErrorCodes: { Challenge: 'CHALLENGE' }
}));

describe('LoginWeb', () => {
  const OLD_ENV = process.env;
  const mockSetState = jest.spyOn(React, 'useState');
  const url = 'https://www.labdigbdbqabv.com';
  const assignMock = jest.fn();

  beforeAll(() => {
    delete window.location;
    window.location = { assign: assignMock as unknown } as Location;
    process.env = { ...OLD_ENV, API_URL: '/api-gateway', DOMAIN: url, TAG: 'LOCAL' };
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

  test('should render LoginWeb component', () => {
    const loginWeb = render(<LoginWeb />);
    expect(loginWeb).toBeTruthy();
  });

  test('should submit login web form', async () => {
    await act(async () => {
      render(<LoginWeb />);
      await waitFor(() => screen.getByTestId('login-web'));
    });
    await act(async () => {
      const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
      const debitKey = screen.getByTestId('debit-key') as HTMLBdbAtInputElement;
      const debitDigits = screen.getByTestId('debit-digits') as HTMLBdbAtInputElement;
      const button = screen.getByTestId('submit-button') as HTMLButtonElement;

      sherpaEvent.type(identificationNumber, { value: '12345678' });
      sherpaEvent.type(debitKey, { value: '1234' });
      sherpaEvent.type(debitDigits, { value: '0987' });
      fireEvent.submit(button);
    });
    expect(mockSetState).toHaveBeenCalled();
  });

  test('should submit failed login web form', async () => {
    login.mockImplementationOnce(() => Promise.reject({ data: authChallengeResponse }));
    jest.spyOn(window.parent, 'postMessage').mockImplementation(jest.fn());
    await act(async () => {
      render(<LoginWeb />);
      await waitFor(() => screen.getByTestId('login-web'));
    });
    await act(async () => {
      const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
      const debitKey = screen.getByTestId('debit-key') as HTMLBdbAtInputElement;
      const debitDigits = screen.getByTestId('debit-digits') as HTMLBdbAtInputElement;
      const button = screen.getByTestId('submit-button') as HTMLButtonElement;

      sherpaEvent.type(identificationNumber, { value: '12345678' });
      sherpaEvent.type(debitKey, { value: '1234' });
      sherpaEvent.type(debitDigits, { value: '0987' });
      fireEvent.submit(button);
    });
    expect(mockSetState).toHaveBeenCalled();
  });

  test('should change tab mode login', async () => {
    render(<LoginWeb />);
    await waitFor(() => screen.getByTestId('login-web'));
    const loginTabs = (await waitFor(() => screen.getByTestId('login-tabs'))) as HTMLBdbMlSecondtabsElement;
    const selectEvent: Event & { detail?: unknown } = createEvent('mlTabsChanged', loginTabs);
    act(() => {
      selectEvent.detail = { id: 2, title: 'Clave segura', disabled: false };
      loginTabs.dispatchEvent(selectEvent);
    });
    expect(mockSetState).toHaveBeenCalled();
  });

  test('should select different document type', async () => {
    const loginForm = render(<LoginWeb />);
    await waitFor(() => screen.getByTestId('login-web'));
    const documentTypeDropdown = (await waitFor(() =>
      screen.getByTestId('identification-type')
    )) as HTMLBdbAtDropdownElement;
    const selectEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', documentTypeDropdown);
    act(() => {
      selectEvent.detail = { text: 'T.I.   Tarjeta de Identidad', value: 'TI' };
      documentTypeDropdown.dispatchEvent(selectEvent);
    });
    expect(loginForm).toBeTruthy();
  });

  test('should send to old portal', async () => {
    render(<LoginWeb />);
    await waitFor(() => screen.getByTestId('login-web'));
    const button = screen.getByTestId('old-portal-button') as HTMLButtonElement;

    fireEvent.click(button);

    expect(true).toBeTruthy();
  });

  test('should submit failed login form and navigate token', async () => {
    login.mockImplementationOnce(() => Promise.reject({ data: authChallengeResponse, status: 409 }));

    await act(async () => {
      render(<LoginWeb />);
      await waitFor(() => screen.getByTestId('login-web'));
    });
    await act(async () => {
      const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
      const debitKey = screen.getByTestId('debit-key') as HTMLBdbAtInputElement;
      const debitDigits = screen.getByTestId('debit-digits') as HTMLBdbAtInputElement;
      const button = screen.getByTestId('submit-button') as HTMLButtonElement;

      sherpaEvent.type(identificationNumber, { value: '12345678' });
      sherpaEvent.type(debitKey, { value: '1234' });
      sherpaEvent.type(debitDigits, { value: '0987' });
      fireEvent.submit(button);
    });
    expect(window.location.href).toEqual(`${url}/validacion-token`);
  });

  test('should navigate to register secure key', async () => {
    const url = 'https://www.labdigbdbqabv.com/clave-segura/registro/validacion-cliente';
    await act(async () => {
      render(<LoginWeb />);
      await waitFor(() => screen.getByTestId('login-web'));
    });
    await act(async () => {
      const button = screen.getByTestId('register-button-loginweb');
      fireEvent.click(button);
    });
    expect(window.location.href).toEqual(url);
  });

  test('should navigate to forget secure key', async () => {
    const url = 'https://www.labdigbdbqabv.com/clave-segura/olvido/validacion-cliente';
    await act(async () => {
      render(<LoginWeb />);
      await waitFor(() => screen.getByTestId('login-web'));
    });
    const loginTabs = (await waitFor(() => screen.getByTestId('login-tabs'))) as HTMLBdbMlSecondtabsElement;
    const selectEvent: Event & { detail?: unknown } = createEvent('mlTabsChanged', loginTabs);
    act(() => {
      selectEvent.detail = { id: 2, title: 'Clave segura', disabled: false };
      loginTabs.dispatchEvent(selectEvent);
    });
    await act(async () => {
      const button = screen.getByTestId('forget-button-loginweb');
      fireEvent.click(button);
    });
    expect(window.location.href).toEqual(url);
  });
});

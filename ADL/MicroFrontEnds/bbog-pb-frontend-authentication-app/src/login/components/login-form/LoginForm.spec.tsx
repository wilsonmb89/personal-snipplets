import React from 'react';
import '@testing-library/jest-dom';
import server, { authChallengeResponse, getTermsAndConditionsResponse, login } from '@test-utils/api-mock';
import sherpaEvent from '@test-utils/sherpa-event';
import store from '../../../store';
import LoginForm from './LoginForm';
import { render, waitFor, screen, createEvent, act, fireEvent } from '@test-utils/provider-mock';
import { rest } from 'msw';

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

describe('LoginForm', () => {
  const OLD_ENV = process.env;
  const mockSetState = jest.spyOn(React, 'useState');
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    window.location = { ...window.location };
    process.env = { ...OLD_ENV, API_URL: '/api-gateway', DOMAIN: 'https://virtual.labdigbdbqapb.com' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
    jest.resetModules();
  });

  afterEach(() => {
    sessionStorage.clear();
    server.resetHandlers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    window.location = location;
    process.env = OLD_ENV;
    server.close();
  });

  test('should render LoginForm component', () => {
    const loginForm = render(<LoginForm />);
    expect(loginForm).toBeTruthy();
  });

  test('should change tab mode login', async () => {
    render(<LoginForm />);
    await waitFor(() => screen.getByTestId('login-form'));
    const loginTabs = (await waitFor(() => screen.getByTestId('login-tabs'))) as HTMLBdbMlSecondtabsElement;
    const selectEvent: Event & { detail?: unknown } = createEvent('mlTabsChanged', loginTabs);
    act(() => {
      selectEvent.detail = { id: 2, title: 'Tarjeta débito', disabled: false };
      loginTabs.dispatchEvent(selectEvent);
    });
    expect(mockSetState).toHaveBeenCalled();
  });

  test('should select different document type', async () => {
    const loginForm = render(<LoginForm />);
    await waitFor(() => screen.getByTestId('login-form'));
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

  test('should submit login form', async () => {
    const url = 'https://virtual.labdigbdbqapb.com/dashboard';
    await act(async () => {
      render(<LoginForm />);
      await waitFor(() => screen.getByTestId('login-form'));
    });
    await act(async () => {
      const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
      const keySecure = screen.getByTestId('key-secure') as HTMLBdbAtInputElement;
      const button = screen.getByText('Ingresar');
      const enterKeyEvent: Event = createEvent('atInputEnterKey', keySecure);
      sherpaEvent.type(identificationNumber, { value: '12345678' });
      sherpaEvent.type(keySecure, { value: '1234' });
      keySecure.dispatchEvent(enterKeyEvent);
      fireEvent.submit(button);
    });
    expect(window.location.href).toEqual(url);
  });

  test('should submit failed login form and navigate token', async () => {
    login.mockImplementationOnce(() => Promise.reject({ data: authChallengeResponse, status: 409 }));

    await act(async () => {
      render(<LoginForm />);
      await waitFor(() => screen.getByTestId('login-form'));
    });
    await act(async () => {
      const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
      const keySecure = screen.getByTestId('key-secure') as HTMLBdbAtInputElement;
      const button = screen.getByText('Ingresar');
      sherpaEvent.type(identificationNumber, { value: '12345678' });
      sherpaEvent.type(keySecure, { value: '1234' });
      fireEvent.submit(button);
    });
    expect(mockedUseNavigate).toHaveBeenCalled();
  });

  test('should submit failed login form', async () => {
    login.mockImplementationOnce(() => Promise.reject({ data: authChallengeResponse }));
    await act(async () => {
      render(<LoginForm />);
      await waitFor(() => screen.getByTestId('login-form'));
    });
    await act(async () => {
      const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
      const keySecure = screen.getByTestId('key-secure') as HTMLBdbAtInputElement;
      const button = screen.getByText('Ingresar');

      sherpaEvent.type(identificationNumber, { value: '12345678' });
      sherpaEvent.type(keySecure, { value: '1234' });
      fireEvent.submit(button);
    });
    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });

  test('should navigate to register secure key', async () => {
    await act(async () => {
      render(<LoginForm />);
      await waitFor(() => screen.getByTestId('login-form'));
    });
    await act(async () => {
      const button = screen.getByTestId('register-button');
      fireEvent.click(button);
    });
    expect(mockedUseNavigate).toHaveBeenCalled();
  });

  test('should navigate to forget secure key', async () => {
    await act(async () => {
      render(<LoginForm />);
      await waitFor(() => screen.getByTestId('login-form'));
    });
    await act(async () => {
      const button = screen.getByTestId('forget-button');
      fireEvent.click(button);
    });
    expect(mockedUseNavigate).toHaveBeenCalled();
  });

  test('should submit login form and accept terms and conditions', async () => {
    const url = 'https://virtual.labdigbdbqapb.com/dashboard';
    server.use(
      rest.post('/api-gateway/user-features/get-terms-and-conditions', (req, res, ctx) =>
        res(ctx.json(getTermsAndConditionsResponse))
      )
    );
    await act(async () => {
      render(<LoginForm />);
      await waitFor(() => screen.getByTestId('login-form'));
    });
    await act(async () => {
      const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
      const keySecure = screen.getByTestId('key-secure') as HTMLBdbAtInputElement;
      const button = screen.getByText('Ingresar');
      const enterKeyEvent: Event = createEvent('atInputEnterKey', keySecure);
      sherpaEvent.type(identificationNumber, { value: '12345678' });
      sherpaEvent.type(keySecure, { value: '1234' });
      keySecure.dispatchEvent(enterKeyEvent);
      fireEvent.submit(button);
      setTimeout(async () => {
        const modalTerms = await waitFor(() => screen.getByTestId('modal-terms'));
        expect(modalTerms).toBeTruthy();
        const clickCloseModalEvent: Event = createEvent('clickedAcceptTermsBtn', modalTerms);
        modalTerms.dispatchEvent(clickCloseModalEvent);
      }, 100);
    });
    expect(window.location.href).toEqual(url);
  });
});

import '@testing-library/jest-dom';
import React from 'react';
import { rest } from 'msw';
import { act, render, waitFor, screen, fireEvent, createEvent, unrender } from '@test-utils/provider-mock';
import { axiosADLInstance } from '@utils/axios-instance';
import store from '../../../store';
import server, { getRegisterBasicDataRes } from '@test-utils/api-mock';
import sherpaEvent from '@test-utils/sherpa-event';
import UserValidation from './UserValidation';

let urlSecureKeyType = 'registro';
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedUseNavigate,
  useLocation: () => ({
    pathname: `http://localhost:4205/clave-segura/${urlSecureKeyType}/validacion-cliente`
  })
}));

axiosADLInstance.interceptors.response.use(
  successRes => {
    return successRes;
  },
  error => {
    return Promise.reject(error.response);
  }
);

describe('UserValidation', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
    unrender();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should render UserValidation page register', () => {
    const userValidationPage = render(<UserValidation />);
    expect(userValidationPage).toBeTruthy();
  });

  test('should render UserValidation page forget', () => {
    urlSecureKeyType = 'olvido';
    const userValidationPage = render(<UserValidation />);
    expect(userValidationPage).toBeTruthy();
  });

  test('should send form user validation - not customer', async () => {
    render(<UserValidation />);
    await waitFor(() => screen.getByTestId('user-validation'));

    const identificationType = screen.getByTestId('identification-type') as HTMLBdbAtDropdownElement;
    const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
    const button = screen.getByTestId('verify-button');

    const dropdownEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', identificationType);
    dropdownEvent.detail = { text: 'T.I.   Tarjeta de Identidad', value: 'TI' };

    await act(async () => {
      identificationType.dispatchEvent(dropdownEvent);
      sherpaEvent.type(identificationNumber, { value: '2006699' });
      fireEvent.submit(button);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);

    const modalText = screen.getByText(
      'Verifica que tu número de identificación esté bien escrito e inténtalo de nuevo.'
    );
    expect(modalText).toBeInTheDocument();
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });

  test('should send form user validation - is customer without secure data', async () => {
    server.use(
      rest.post('/api-gateway/register-unchecked/get-register-basic-data', (_req, res, ctx) =>
        res(ctx.json(getRegisterBasicDataRes.notSecureData))
      )
    );
    render(<UserValidation />);
    await waitFor(() => screen.getByTestId('user-validation'));

    const identificationType = screen.getByTestId('identification-type') as HTMLBdbAtDropdownElement;
    const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
    const button = screen.getByTestId('verify-button');

    const dropdownEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', identificationType);
    dropdownEvent.detail = { text: 'T.I.   Tarjeta de Identidad', value: 'TI' };

    await act(async () => {
      identificationType.dispatchEvent(dropdownEvent);
      sherpaEvent.type(identificationNumber, { value: '2006699' });
      fireEvent.submit(button);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);

    const modalText = await screen.findByText(
      'Para continuar con este proceso, por favor acércate a una oficina a registrar tu número de celular y correo electrónico como datos de acceso a canales virtuales.'
    );
    expect(modalText).toBeInTheDocument();
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();

    expect(mockedUseNavigate).toHaveBeenCalled();
  });

  test('should send form user validation - is customer without products', async () => {
    server.use(
      rest.post('/api-gateway/register-unchecked/get-register-basic-data', (_req, res, ctx) =>
        res(ctx.json(getRegisterBasicDataRes.noActiveProducts))
      )
    );
    render(<UserValidation />);
    await waitFor(() => screen.getByTestId('user-validation'));

    const identificationType = screen.getByTestId('identification-type') as HTMLBdbAtDropdownElement;
    const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
    const button = screen.getByTestId('verify-button');

    const dropdownEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', identificationType);
    dropdownEvent.detail = { text: 'T.I.   Tarjeta de Identidad', value: 'TI' };

    await act(async () => {
      identificationType.dispatchEvent(dropdownEvent);
      sherpaEvent.type(identificationNumber, { value: '2006699' });
      fireEvent.submit(button);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);

    const modalText = await screen.findByText(
      'Por favor verifica el estado de tus productos, comunícate a la Servilínea o acércate a una de nuestras oficinas.'
    );
    expect(modalText).toBeInTheDocument();
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();

    expect(mockedUseNavigate).toHaveBeenCalled();
  });

  test('should validate forget without secure key', async () => {
    server.use(
      rest.post('/api-gateway/register-unchecked/get-register-basic-data', (_req, res, ctx) =>
        res(ctx.json(getRegisterBasicDataRes.register))
      )
    );
    render(<UserValidation />);
    await waitFor(() => screen.getByTestId('user-validation'));

    const identificationType = screen.getByTestId('identification-type') as HTMLBdbAtDropdownElement;
    const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
    const button = screen.getByTestId('verify-button');

    const dropdownEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', identificationType);
    dropdownEvent.detail = { text: 'T.I.   Tarjeta de Identidad', value: 'TI' };

    await act(async () => {
      identificationType.dispatchEvent(dropdownEvent);
      sherpaEvent.type(identificationNumber, { value: '2006699' });
      fireEvent.submit(button);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);

    const modalText = await screen.findByText('Registrarme');
    expect(modalText).toBeInTheDocument();
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();

    expect(mockedUseNavigate).toHaveBeenCalled();
  });

  test('should validate forget with secure key', async () => {
    server.use(
      rest.post('/api-gateway/register-unchecked/get-register-basic-data', (_req, res, ctx) =>
        res(ctx.json(getRegisterBasicDataRes.forget))
      )
    );
    const userValidationPage = render(<UserValidation />);
    await waitFor(() => screen.getByTestId('user-validation'));

    const identificationType = screen.getByTestId('identification-type') as HTMLBdbAtDropdownElement;
    const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
    const button = screen.getByTestId('verify-button');

    const dropdownEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', identificationType);
    dropdownEvent.detail = { text: 'T.I.   Tarjeta de Identidad', value: 'TI' };

    await act(async () => {
      identificationType.dispatchEvent(dropdownEvent);
      sherpaEvent.type(identificationNumber, { value: '2006699' });
      fireEvent.submit(button);
    });

    expect(userValidationPage).toBeTruthy();
  });

  test('should validate register without secure key', async () => {
    urlSecureKeyType = 'registro';
    server.use(
      rest.post('/api-gateway/register-unchecked/get-register-basic-data', (_req, res, ctx) =>
        res(ctx.json(getRegisterBasicDataRes.register))
      )
    );
    const userValidationPage = render(<UserValidation />);
    await waitFor(() => screen.getByTestId('user-validation'));

    const identificationType = screen.getByTestId('identification-type') as HTMLBdbAtDropdownElement;
    const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
    const button = screen.getByTestId('verify-button');

    const dropdownEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', identificationType);
    dropdownEvent.detail = { text: 'T.I.   Tarjeta de Identidad', value: 'TI' };

    await act(async () => {
      identificationType.dispatchEvent(dropdownEvent);
      sherpaEvent.type(identificationNumber, { value: '2006699' });
      fireEvent.submit(button);
    });

    expect(userValidationPage).toBeTruthy();
  });

  test('should validate register with secure key', async () => {
    urlSecureKeyType = 'registro';
    server.use(
      rest.post('/api-gateway/register-unchecked/get-register-basic-data', (_req, res, ctx) =>
        res(ctx.json(getRegisterBasicDataRes.forget))
      )
    );
    render(<UserValidation />);
    await waitFor(() => screen.getByTestId('user-validation'));

    const identificationType = screen.getByTestId('identification-type') as HTMLBdbAtDropdownElement;
    const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
    const button = screen.getByTestId('verify-button');

    const dropdownEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', identificationType);
    dropdownEvent.detail = { text: 'T.I.   Tarjeta de Identidad', value: 'TI' };

    await act(async () => {
      identificationType.dispatchEvent(dropdownEvent);
      sherpaEvent.type(identificationNumber, { value: '2006699' });
      fireEvent.submit(button);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);

    const modalText = await screen.findByText('Olvidé mi clave');
    expect(modalText).toBeInTheDocument();
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();

    expect(mockedUseNavigate).toHaveBeenCalled();
  });

  test('should send form user validation error', async () => {
    server.use(
      rest.post('/api-gateway/register-unchecked/get-register-basic-data', (_req, res, ctx) => res(ctx.status(409)))
    );
    render(<UserValidation />);
    await waitFor(() => screen.getByTestId('user-validation'));

    const identificationType = screen.getByTestId('identification-type') as HTMLBdbAtDropdownElement;
    const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
    const button = screen.getByTestId('verify-button');

    const dropdownEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', identificationType);
    dropdownEvent.detail = { text: 'T.I.   Tarjeta de Identidad', value: 'TI' };

    await act(async () => {
      identificationType.dispatchEvent(dropdownEvent);
      sherpaEvent.type(identificationNumber, { value: '2006699' });
      fireEvent.submit(button);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });

  test('should send form user validation error network', async () => {
    server.use(
      rest.post('/api-gateway/register-unchecked/get-register-basic-data', (_req, res, ctx) => res(ctx.status(409)))
    );
    const userValidationPage = render(<UserValidation />);
    await waitFor(() => screen.getByTestId('user-validation'));

    const identificationType = screen.getByTestId('identification-type') as HTMLBdbAtDropdownElement;
    const identificationNumber = screen.getByTestId('identification-number') as HTMLBdbAtInputElement;
    const button = screen.getByTestId('verify-button');

    const dropdownEvent: Event & { detail?: unknown } = createEvent('elementSelectedAtom', identificationType);
    dropdownEvent.detail = { text: 'T.I.   Tarjeta de Identidad', value: 'TI' };

    await act(async () => {
      identificationType.dispatchEvent(dropdownEvent);
      sherpaEvent.type(identificationNumber, { value: '2006699' });
      fireEvent.submit(button);
    });

    expect(userValidationPage).toBeTruthy();
  });
});

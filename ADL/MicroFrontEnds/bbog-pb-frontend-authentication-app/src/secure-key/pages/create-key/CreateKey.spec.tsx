import React from 'react';
import '@testing-library/jest-dom';
import server from '@test-utils/api-mock';
import store from '../../../store';
import CreateKey from './CreateKey';
import { act, render, waitFor, screen, fireEvent, unrender, createEvent } from '@test-utils/provider-mock';
import sherpaEvent from '@test-utils/sherpa-event';
import { customerActions } from '@secure-key/store/customer/customer.store';
import { rest } from 'msw';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedUseNavigate
}));

describe('CreateKey', () => {
  const OLD_ENV = process.env;
  const mockSetState = jest.spyOn(React, 'useState');

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
    store.dispatch(customerActions.setIsForgetFlow(true));
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

  test('should render CreateKey page', () => {
    const createKeyPage = render(<CreateKey />);
    expect(createKeyPage).toBeTruthy();
  });

  test('should change Key', async () => {
    await act(async () => {
      render(<CreateKey />);
      await waitFor(() => screen.getByTestId('create-key'));
    });
    const secureKey = screen.getByTestId('secure-key') as HTMLBdbAtInputElement;
    const confirmSecureKey = screen.getByTestId('confirm-secure-key') as HTMLBdbAtInputElement;
    const createButton = screen.getByText('Verificar');

    await act(async () => {
      sherpaEvent.type(secureKey, { value: '1234' });
      sherpaEvent.type(confirmSecureKey, { value: '1234' });
      fireEvent.submit(createButton);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);

    const modalText = screen.getByText('Tu nueva clave segura ha sido creada con éxito.');
    expect(modalText).toBeInTheDocument();
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();

    expect(mockedUseNavigate).toHaveBeenCalled();
  });

  test('should create new Key', async () => {
    await act(async () => {
      render(<CreateKey />);
      await waitFor(() => screen.getByTestId('create-key'));
    });
    const secureKey = screen.getByTestId('secure-key') as HTMLBdbAtInputElement;
    const confirmSecureKey = screen.getByTestId('confirm-secure-key') as HTMLBdbAtInputElement;
    const createButton = screen.getByText('Verificar');
    await store.dispatch(customerActions.setIsForgetFlow(false));

    await act(async () => {
      sherpaEvent.type(secureKey, { value: '1234' });
      sherpaEvent.type(confirmSecureKey, { value: '1234' });
      fireEvent.submit(createButton);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });

  test('should fail change secure Key', async () => {
    server.use(
      rest.post('/api-gateway/register-checked/v2/reset-secure-key', (_req, res, ctx) => res(ctx.status(409)))
    );
    await act(async () => {
      render(<CreateKey />);
      await waitFor(() => screen.getByTestId('create-key'));
    });

    const secureKey = screen.getByTestId('secure-key') as HTMLBdbAtInputElement;
    const confirmSecureKey = screen.getByTestId('confirm-secure-key') as HTMLBdbAtInputElement;
    const createButton = screen.getByText('Verificar');

    await act(async () => {
      sherpaEvent.type(secureKey, { value: '1234' });
      sherpaEvent.type(confirmSecureKey, { value: '1234' });
      fireEvent.submit(createButton);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });

  test('should send with different key', async () => {
    await act(async () => {
      render(<CreateKey />);
      await waitFor(() => screen.getByTestId('create-key'));
    });

    const secureKey = screen.getByTestId('secure-key') as HTMLBdbAtInputElement;
    const confirmSecureKey = screen.getByTestId('confirm-secure-key') as HTMLBdbAtInputElement;

    await act(async () => {
      sherpaEvent.type(secureKey, { value: '1234' });
      sherpaEvent.type(confirmSecureKey, { value: '1235' });
      const inputEvent: Event & { detail?: unknown } = createEvent('atInputUpdated', confirmSecureKey);
      confirmSecureKey.dispatchEvent(inputEvent);
    });

    expect(mockSetState).toHaveBeenCalled();
  });
});

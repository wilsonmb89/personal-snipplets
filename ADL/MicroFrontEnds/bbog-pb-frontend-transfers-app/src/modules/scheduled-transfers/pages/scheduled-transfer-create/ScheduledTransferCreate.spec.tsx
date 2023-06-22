import React from 'react';
import '@testing-library/jest-dom';
import { render, waitFor, screen, createEvent, fireEvent } from '../../../../test-utils/provider-mock';
import store from '../../../../store';
import server from '../../../../test-utils/api-mock';
import ScheduledTransferCreate from './ScheduledTransferCreate';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/programadas/crear'
  })
}));

describe('ScheduledTransferCreate', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    render(<ScheduledTransferCreate />);
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should render ScheduledTransferCreate component', () => {
    const app = render(<ScheduledTransferCreate />);
    expect(app).toBeTruthy();
  });

  test('should display title', async () => {
    await waitFor(() => screen.getByTestId('scheduled-create-page'));
    expect(screen.queryByText(/Programación a cuenta/i)).toBeInTheDocument();
  });

  test('should simulate leave of create', async () => {
    jest.spyOn(URLSearchParams.prototype, 'get').mockImplementation(key => key);

    const header: HTMLElement = await waitFor(() => screen.getByTestId('header'));

    const clickOptionEventHeader: Event & { detail?: unknown } = createEvent('backBtnClicked', header);
    clickOptionEventHeader.detail = { value: 'Cerrar' };

    header.dispatchEvent(clickOptionEventHeader);
    fireEvent(header, clickOptionEventHeader);

    const modalConfirmation: HTMLElement = await waitFor(() => screen.getByTestId('notification-modal'));

    const clickOptionEventModal: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalConfirmation);
    clickOptionEventModal.detail = { value: 'Sí, abandonar' };

    modalConfirmation.dispatchEvent(clickOptionEventModal);
    fireEvent(modalConfirmation, clickOptionEventModal);
    expect(header).toBeTruthy();
    expect(modalConfirmation).toBeTruthy();
  });

  test('should simulate of comeback to create', async () => {
    const header: HTMLElement = await waitFor(() => screen.getByTestId('header'));

    const clickOptionEventHeader: Event & { detail?: unknown } = createEvent('backBtnClicked', header);
    clickOptionEventHeader.detail = { value: 'Cerrar' };

    header.dispatchEvent(clickOptionEventHeader);
    fireEvent(header, clickOptionEventHeader);

    const modalConfirmation: HTMLElement = await waitFor(() => screen.getByTestId('notification-modal'));

    const clickOptionEventCon: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalConfirmation);
    clickOptionEventCon.detail = { value: 'No, regresar' };

    modalConfirmation.dispatchEvent(clickOptionEventCon);
    fireEvent(modalConfirmation, clickOptionEventCon);
    expect(header).toBeTruthy();
    expect(modalConfirmation).toBeTruthy();
  });

  test('should simulate leave of create from other option', async () => {
    const header: HTMLElement = await waitFor(() => screen.getByTestId('header'));

    const clickOptionEventHeader: Event & { detail?: unknown } = createEvent('forwardBtnClicked', header);
    clickOptionEventHeader.detail = { value: 'Atrás' };

    header.dispatchEvent(clickOptionEventHeader);
    fireEvent(header, clickOptionEventHeader);
    const modalConfirmation: HTMLElement = await waitFor(() => screen.getByTestId('notification-modal'));

    const clickOptionEventModal: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalConfirmation);
    clickOptionEventModal.detail = { value: 'Sí, abandonar' };

    modalConfirmation.dispatchEvent(clickOptionEventModal);
    fireEvent(modalConfirmation, clickOptionEventModal);
    expect(header).toBeTruthy();
    expect(modalConfirmation).toBeTruthy();
  });
});

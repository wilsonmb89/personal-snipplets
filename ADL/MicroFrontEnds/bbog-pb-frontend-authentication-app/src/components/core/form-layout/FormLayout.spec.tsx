import React from 'react';
import '@testing-library/jest-dom';
import server from '@test-utils/api-mock';
import store from '../../../store';
import FormLayout from './FormLayout';
import { render, waitFor, screen, createEvent, act, fireEvent } from '@test-utils/provider-mock';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedUseNavigate
}));

describe('Form Layout', () => {
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
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should render Login page', () => {
    const loginPage = render(<FormLayout title={'Ingreso a Banca Virtual'} />);
    expect(loginPage).toBeTruthy();
  });

  test('should back button clicked', async () => {
    render(<FormLayout title={'Ingreso a Banca Virtual'} />);
    const bvHeader = (await waitFor(() => screen.getByTestId('layout-header'))) as HTMLBdbMlHeaderBvElement;
    const backEvent: Event = createEvent('backBtnClicked', bvHeader);
    act(() => {
      bvHeader.dispatchEvent(backEvent);
    });
    expect(mockedUseNavigate).toHaveBeenCalled();
  });

  test('should forward button clicked and accept', async () => {
    render(<FormLayout title={'Ingreso a Banca Virtual'} />);
    const bvHeader = (await waitFor(() => screen.getByTestId('layout-header'))) as HTMLBdbMlHeaderBvElement;
    const forwardEvent: Event = createEvent('forwardBtnClicked', bvHeader);
    act(() => {
      bvHeader.dispatchEvent(forwardEvent);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Sí, abandonar' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
    expect(mockedUseNavigate).toHaveBeenCalled();
  });

  test('should forward button clicked and reject', async () => {
    render(<FormLayout title={'Ingreso a Banca Virtual'} />);
    const bvHeader = (await waitFor(() => screen.getByTestId('layout-header'))) as HTMLBdbMlHeaderBvElement;
    const forwardEvent: Event = createEvent('forwardBtnClicked', bvHeader);
    act(() => {
      bvHeader.dispatchEvent(forwardEvent);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'No, regresar' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });
});

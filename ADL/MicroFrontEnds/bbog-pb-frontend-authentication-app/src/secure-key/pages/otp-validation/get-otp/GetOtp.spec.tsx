import React from 'react';
import { rest } from 'msw';
import '@testing-library/jest-dom';
import server, { getRegisterBasicDataRes } from '@test-utils/api-mock';
import { act, render, waitFor, screen, fireEvent, unrender, createEvent } from '@test-utils/provider-mock';
import { customerActions } from '@secure-key/store/customer/customer.store';
import store from '@store/index';
import GetOtp from './GetOtp';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedUseNavigate
}));

describe('GetOtp', () => {
  const mockSetState = jest.spyOn(React, 'useState');
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
    store.dispatch(customerActions.setIsForgetFlow(true));
    store.dispatch(customerActions.setBasicData(getRegisterBasicDataRes.forget));
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

  test('should render GetOtp page', () => {
    const getOtpPage = render(<GetOtp />);
    expect(getOtpPage).toBeTruthy();
  });

  test('should send getOtp', async () => {
    await act(async () => {
      render(<GetOtp />);
      await waitFor(() => screen.getByTestId('get-otp-page'));
      const otpComponent = screen.getByTestId('get-otp') as HTMLBdbMlBmOtpElement;
      const otpEvent: Event & { detail?: unknown } = createEvent('buttonClicked', otpComponent);
      otpComponent.dispatchEvent(otpEvent);
    });

    expect(mockSetState).toHaveBeenCalled();
  });

  test('should error getOtp', async () => {
    server.use(rest.post('/api-gateway/register-unchecked/get-otp', (_req, res, ctx) => res(ctx.status(409))));
    store.dispatch(customerActions.setIsForgetFlow(false));
    await act(async () => {
      render(<GetOtp />);
      await waitFor(() => screen.getByTestId('get-otp-page'));
      const otpComponent = screen.getByTestId('get-otp') as HTMLBdbMlBmOtpElement;
      const otpEvent: Event & { detail?: unknown } = createEvent('buttonClicked', otpComponent);
      otpComponent.dispatchEvent(otpEvent);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });

  test('should click not number button', async () => {
    await act(async () => {
      render(<GetOtp />);
      await waitFor(() => screen.getByTestId('get-otp-page'));
      const otpComponent = screen.getByTestId('get-otp') as HTMLBdbMlBmOtpElement;
      const otpEvent: Event & { detail?: unknown } = createEvent('secondButtonClicked', otpComponent);
      otpComponent.dispatchEvent(otpEvent);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
    expect(mockedUseNavigate).toHaveBeenCalled();
  });
});

import React from 'react';
import { rest } from 'msw';
import '@testing-library/jest-dom';
import server, { getRegisterBasicDataRes } from '@test-utils/api-mock';
import { act, render, waitFor, screen, fireEvent, unrender, createEvent } from '@test-utils/provider-mock';
import { customerActions } from '@secure-key/store/customer/customer.store';
import store from '@store/index';
import OtpAuth from './OtpAuth';
import { axiosADLInstance } from '@utils/axios-instance';
import { OtpExceedAttempts } from '@secure-key/constants/secure-key-modal-messages';

const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedUseNavigate
}));

axiosADLInstance.interceptors.response.use(
  successRes => {
    return successRes;
  },
  error => {
    return Promise.reject({
      message: error.response.data.message,
      name: error.response.data.name,
      type: error.response.data.type,
      status: error.response.status,
      data: error.response.data.data
    });
  }
);

describe('OtpAuth', () => {
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

  test('should render OtpAuth page', () => {
    const otpAuthPage = render(<OtpAuth />);
    expect(otpAuthPage).toBeTruthy();
  });

  test('should send otpAuth', async () => {
    await act(async () => {
      render(<OtpAuth />);
      await waitFor(() => screen.getByTestId('otp-auth-page'));
    });
    const otpInput = screen.getByTestId('otp-auth') as HTMLBdbMlBmTokenElement;
    const submitOtpEvent: Event & { detail?: unknown } = createEvent('buttonClicked', otpInput);
    await act(async () => {
      submitOtpEvent.detail = { code: '123456' };
      otpInput.dispatchEvent(submitOtpEvent);
    });
    expect(otpInput).toBeTruthy();
  });

  test('should resend code', async () => {
    await act(async () => {
      render(<OtpAuth />);
      await waitFor(() => screen.getByTestId('otp-auth-page'));
    });
    const otpInput = screen.getByTestId('otp-auth') as HTMLBdbMlBmTokenElement;
    await act(async () => {
      const submitOtpEvent: Event & { detail?: unknown } = createEvent('sendCodeClicked', otpInput);
      otpInput.dispatchEvent(submitOtpEvent);
    });
    expect(otpInput).toBeTruthy();
  });

  test('should error otpAuth', async () => {
    server.use(
      rest.post('/api-gateway/authentication/v3/otp-auth', (_req, res, ctx) =>
        res(ctx.status(500), ctx.json({ type: 'error', name: 'error', message: 'error' }))
      )
    );
    await act(async () => {
      render(<OtpAuth />);
      await waitFor(() => screen.getByTestId('otp-auth-page'));
    });
    await act(async () => {
      const otpInput = screen.getByTestId('otp-auth') as HTMLBdbMlBmTokenElement;
      const submitOtpEvent: Event & { detail?: unknown } = createEvent('buttonClicked', otpInput);
      submitOtpEvent.detail = { code: '123456' };
      otpInput.dispatchEvent(submitOtpEvent);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });

  test('should error validateProducts', async () => {
    server.use(
      rest.post('/api-gateway/register-checked/get-validation-products', (_req, res, ctx) => res(ctx.status(409)))
    );
    await act(async () => {
      render(<OtpAuth />);
      await waitFor(() => screen.getByTestId('otp-auth-page'));
    });
    await act(async () => {
      const otpInput = screen.getByTestId('otp-auth') as HTMLBdbMlBmTokenElement;
      const submitOtpEvent: Event & { detail?: unknown } = createEvent('buttonClicked', otpInput);
      submitOtpEvent.detail = { code: '123456' };
      otpInput.dispatchEvent(submitOtpEvent);
    });

    const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
    const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
    clickAction.detail = { value: 'Entendido' };

    modalMessage.dispatchEvent(clickAction);
    fireEvent(modalMessage, clickAction);
    expect(modalMessage).toBeTruthy();
  });

  test('should block OTP exceed attempts', async () => {
    server.use(rest.post('/api-gateway/authentication/v3/otp-auth', (_req, res, ctx) => res(ctx.status(409))));
    await act(async () => {
      render(<OtpAuth />);
      await waitFor(() => screen.getByTestId('otp-auth-page'));
    });
    const otpInput = screen.getByTestId('otp-auth') as HTMLBdbMlBmTokenElement;
    const submitOtpEvent: Event & { detail?: unknown } = createEvent('buttonClicked', otpInput);

    const invalidOtp = ['111111', '222222', '333333', '444444', '555555'];
    for (let i = 0; i < invalidOtp.length; i++) {
      await act(async () => {
        submitOtpEvent.detail = { code: invalidOtp[i] };
        otpInput.dispatchEvent(submitOtpEvent);
      });
    }

    setTimeout(async () => {
      const modalMessage: HTMLBdbMlModalElement = await waitFor(() => screen.findByTestId('notification-modal'));
      const clickAction: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalMessage);
      const modalText = screen.getByText(OtpExceedAttempts.message as string);
      expect(modalText).toBeInTheDocument();

      clickAction.detail = { value: 'Entendido' };
      modalMessage.dispatchEvent(clickAction);
      fireEvent(modalMessage, clickAction);
      expect(modalMessage).toBeTruthy();
    }, 100);
  });
});

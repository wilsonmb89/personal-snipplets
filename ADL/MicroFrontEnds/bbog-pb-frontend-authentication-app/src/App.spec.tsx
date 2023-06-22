import React, { Suspense } from 'react';
import store from './store';
import { render, screen, waitFor } from '@test-utils/provider-mock';
import { loadingActions } from '@store/loader/loader.store';
import { customerActions } from '@secure-key/store/customer/customer.store';
import { customerData } from '@test-utils/api-mock';
import App, {
  CreateKey,
  LoginPortal,
  ProductValidation,
  TokenLogin,
  UserValidation,
  GetOtp,
  OtpValidation
} from './App';

describe('App unit tests', () => {
  const navigate = jest.fn();

  test('should start the application succesfully', () => {
    store.dispatch({ type: 'MOUNT' });
    const app = render(<App navigate={navigate} />);
    expect(app).toBeTruthy();
  });

  test('shoulld load lazy components', async () => {
    const app = render(
      <Suspense fallback={<div>Loader</div>}>
        <LoginPortal />
        <TokenLogin />
        <UserValidation />
        <ProductValidation />
        <CreateKey />
        <GetOtp />
        <OtpValidation />
      </Suspense>
    );
    expect(app).toBeTruthy();
  });

  test('should load loginweb if #/loginweb hash is enabled', async () => {
    jest.mock('@login/hooks/useLogin', () => ({
      useLogin: jest.fn().mockImplementation(() => ({ submitLogin: jest.fn() }))
    }));
    window.history.pushState({}, 'Login Web', '/#/loginweb');
    store.dispatch(loadingActions.enable());
    render(<App navigate={navigate} />);
    const loginWebEl = await waitFor(() => screen.getByTestId('login-web'));
    expect(loginWebEl).toBeTruthy();
  });

  test('should navigate to login in pages without data', async () => {
    window.history.pushState({}, 'Send OTP', '/clave-segura/registro/envio-otp');
    render(<App navigate={navigate} />);
    const loginPage = await waitFor(() => screen.getByTestId('login-info'));
    expect(loginPage).toBeTruthy();
  });

  test('should navigate to page in pages with data', async () => {
    store.dispatch(customerActions.setCustomer(customerData));
    window.history.pushState({}, 'Send OTP', '/clave-segura/registro/envio-otp');
    render(<App navigate={navigate} />);
    const registerOtpPage = await waitFor(() => screen.getByTestId('get-otp-page'));
    expect(registerOtpPage).toBeTruthy();
  });
});

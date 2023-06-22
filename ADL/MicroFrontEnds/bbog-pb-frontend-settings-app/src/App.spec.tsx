import React from 'react';
import App from './App';
import { render, screen, waitFor, waitForElementToBeRemoved } from './test-utils/provider-mock';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import store from './store';
import { loadingActions } from './store/loader/loader.store';
import { showError } from './store/error/error.store';
import { showToast } from './store/toast/toast.store';
import userEvent from '@testing-library/user-event';
import { createInterceptors } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import server, { getProductsResponse } from './test-utils/api-mock';
import { encrypt } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import { axiosADLInstance } from '@utils/constants';

describe('App', () => {
  const OLD_ENV = process.env;
  const navigate = jest.fn();

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should start the application succesfully', () => {
    const app = render(<App navigate={navigate} />);
    expect(app).toBeTruthy();
  });

  test('should show loading if state loding is true', async () => {
    render(<App navigate={navigate} />);

    await waitForElementToBeRemoved(screen.getByRole('dialog'));

    const loader = screen.queryByRole('dialog');
    expect(loader).toBeNull();

    store.dispatch(loadingActions.enable());

    await waitFor(() => screen.getByRole('dialog'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('should show error modal if there is any error and close it on click "entendido" button', async () => {
    render(<App navigate={navigate} />);

    store.dispatch(showError({ name: 'test name error', message: 'test error message' }));

    await waitFor(() => screen.getByText('test name error'));
    await waitFor(() => screen.getByText('test error message'));

    expect(screen.getByText('test name error')).toBeInTheDocument();
    expect(screen.getByText('test error message')).toBeInTheDocument();

    const closeModalButton = screen.getByText('Entendido');
    userEvent.click(closeModalButton);

    const modalTitle = screen.queryByText('test name error');
    expect(modalTitle).toBeNull();
  });

  test('should show a toast if there is any toast message', async () => {
    render(<App navigate={navigate} />);
    store.dispatch(showToast('test message toast'));

    await waitFor(() => screen.getByRole('dialog'));
    const tooltip = screen.getByRole('dialog');

    expect(tooltip.getAttribute('text')).toEqual('test message toast');

    const tooltipEvent = new Event('toastClosed');
    tooltip.dispatchEvent(tooltipEvent);

    const tooltipRemoved = screen.queryByRole('dialog');
    expect(tooltipRemoved).toBeNull();
  });

  test('should render limits form', async () => {
    window.history.pushState({}, 'Limits Form page', '/settings/limits-form');
    render(<App navigate={navigate} />);
    await waitFor(() => screen.getByTestId('limits-form-page'));
    expect(screen.getByTestId('limits-form-page')).toBeInTheDocument();
  });
});

describe('encrypted data', () => {
  const OLD_ENV = process.env;
  const navigate = jest.fn();

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway', TAG: 'PRO' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  it('should send encrypted data on STG', async () => {
    const ress = JSON.stringify(getProductsResponse);
    server.use(
      rest.post('products/get-all', (req, res, ctx) => {
        return res(ctx.text(btoa(ress)));
      })
    );
    const publicKeyMock = encrypt({
      publicKey: 'dummy_public_key',
      diffTime: -242
    });
    sessionStorage.setItem(btoa('PublicKeyState'), publicKeyMock);
    sessionStorage.setItem(btoa('access-token'), encrypt('dummy_access_token'));

    await createInterceptors(true, axiosADLInstance);
    window.history.pushState({}, 'Accounts page', '/');
    render(<App navigate={navigate} />);
    await waitFor(() => screen.getAllByTestId('account-item'));
    const pulseItems = screen.getAllByTestId('account-item');

    expect(pulseItems.length).toEqual(1);
    expect(pulseItems[0].getAttribute('itemId')).toEqual('0023051352');
  });
});

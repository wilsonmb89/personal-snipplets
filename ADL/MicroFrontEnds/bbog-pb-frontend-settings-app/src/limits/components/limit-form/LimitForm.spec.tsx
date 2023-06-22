import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '../../../test-utils/provider-mock';
import App from '../../../App';
import store from '../../../store';
import userEvent from '@testing-library/user-event';
import { updateLimitActions } from '../../store/update/update.reducer';
import { act, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import server from '../../../test-utils/api-mock';
import { rest } from 'msw';

const enableLimits = async () => {
  const enableLimitsButton = screen.getByText('Editar topes');
  userEvent.click(enableLimitsButton);

  await waitFor(() => screen.getByTestId('token-input-text'));

  const tokenInput = screen.getByTestId('token-input-text');

  userEvent.type(tokenInput, '801084');

  const sendTokenButton = screen.getByText('Continuar');
  userEvent.click(sendTokenButton);

  await waitForElementToBeRemoved(screen.getByTestId('token-input-text'));
};

describe('LimitForm', () => {
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
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.close();
  });

  test('should save limit successfully', async () => {
    window.history.pushState({}, 'Limits Form page', '/settings/limits-form');
    render(<App navigate={navigate} />);
    await waitFor(() => screen.getByTestId('BM_form'), { timeout: 10000 });
    await enableLimits();
    const bmLimitForm = screen.getByTestId('BM_form');
    const amountInput = bmLimitForm.querySelector('input[name="amount"]');
    await act(async () => {
      userEvent.clear(amountInput);
      userEvent.type(amountInput, '1000000');
    });
    expect(amountInput).toHaveDisplayValue('$1,000,000');

    const saveLimitButton = bmLimitForm.querySelector('pulse-button');
    fireEvent.submit(saveLimitButton);

    await waitFor(() => screen.getByTestId('pulse-toast'));
    const toast = screen.getByTestId('pulse-toast');

    expect(toast.getAttribute('text')).toEqual('Cambio de topes exitoso');
  });

  test('should show modal and save limit and account successfully if limit > accountlimit', async () => {
    window.history.pushState({}, 'Limits Form page', '/settings/limits-form');
    server.use(
      rest.post('/api-gateway/customer-security/get-limits-nat-acc', (req, res, ctx) =>
        res(ctx.json({ bankLimit: [{ amount: '5000000', trnCode: '0320', typeField: null }] }))
      )
    );
    render(<App navigate={navigate} />);
    store.dispatch(updateLimitActions.setAccountForUpdate({ acctId: '1234', acctType: 'SDA' }));
    await waitFor(() => screen.getByTestId('PB_form'));
    await enableLimits();
    const bmLimitForm = screen.getByTestId('PB_form');
    const amountInput = bmLimitForm.querySelector('input[name="amount"]');
    await act(async () => {
      userEvent.clear(amountInput);
      userEvent.type(amountInput, '6000000');
    });
    expect(amountInput).toHaveDisplayValue('$6,000,000');

    const saveLimitButton = bmLimitForm.querySelector('pulse-button');
    fireEvent.submit(saveLimitButton);

    await waitFor(() => screen.getByText('Actualizamos tu Límite de Cuenta'));

    expect(screen.getByText('Actualizamos tu Límite de Cuenta')).toBeInTheDocument();
  });

  test('should show warning if account limit is less than any limit', async () => {
    window.history.pushState({}, 'Limits Form page', '/settings/limits-form');
    server.use(
      rest.post('/api-gateway/customer-security/get-limits-nat-acc', (req, res, ctx) =>
        res(ctx.json({ bankLimit: [{ amount: '5000000', trnCode: '0320', typeField: null }] }))
      )
    );
    render(<App navigate={navigate} />);
    await waitFor(() => screen.getByTestId('0320_form'));
    await enableLimits();
    const accountLimitForm = screen.getByTestId('0320_form');
    const amountInput = accountLimitForm.querySelector('input[name="amount"]');
    await act(async () => {
      userEvent.clear(amountInput);
      userEvent.type(amountInput, '1');
    });
    expect(amountInput).toHaveDisplayValue('$1');

    const saveLimitButton = accountLimitForm.querySelector('pulse-button');
    fireEvent.submit(saveLimitButton);

    await waitFor(() => screen.getByText('Algunos topes son mayores a Límite de Cuenta'));

    const sendTokenButton = screen.getByText('Sí, continuar');
    userEvent.click(sendTokenButton);

    await waitFor(() => screen.getByTestId('pulse-toast'));
    const toast = screen.getByTestId('pulse-toast');

    expect(toast.getAttribute('text')).toEqual('Cambio de topes exitoso');
  });
});

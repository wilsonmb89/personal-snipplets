import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../../test-utils/provider-mock';
import Accounts from './Accounts';
import App from '../../../App';
import store from '../../../store';
import userEvent from '@testing-library/user-event';
import { decrypt } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import { UpdateLimitState } from '../../store/update/update.entity';
import { getProductsResponse } from '../../../test-utils/api-mock';

const server = setupServer(
  rest.post('/api-gateway/products/get-all', (req, res, ctx) =>
    res(
      ctx.json({
        accountList: [
          {
            productName: 'Cuenta AFC',
            description: 'AH AFC',
            officeId: '0190',
            productAthType: 'AF',
            productBankType: 'SDA',
            productBankSubType: '067AH',
            productNumber: '0190109892',
            valid: true,
            franchise: '',
            openDate: '2019-10-10'
          },
          {
            productName: 'Cuenta Corriente Comercial',
            description: 'CC Cuentas comerciales',
            officeId: '0023',
            productAthType: 'IM',
            productBankType: 'DDA',
            productBankSubType: '010CC',
            productNumber: '0023051352',
            valid: true,
            franchise: '',
            openDate: '2020-03-11'
          },
          {
            productName: 'Tarjeta de Crédito Black',
            description: 'MASTERCARD BLACK',
            officeId: '',
            productAthType: 'MC',
            productBankType: 'CCA',
            productBankSubType: '553661TC',
            productNumber: '5536610804445938',
            bin: '553661',
            valid: true,
            franchise: 'Mastercard',
            openDate: '2020-07-27'
          }
        ]
      })
    )
  )
);

describe('Account', () => {
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

  test('should render component', () => {
    render(<Accounts navigate={navigate} />);
  });

  test('should show a list of savings accounts from the api', async () => {
    render(<Accounts navigate={navigate} />);

    await waitFor(() => screen.getAllByTestId('account-item'));
    const pulseItems = screen.getAllByTestId('account-item');

    expect(pulseItems.length).toEqual(1);
    expect(pulseItems[0].getAttribute('itemId')).toEqual('0023051352');
  });

  test('should call navigation callback when back button is pressed', async () => {
    render(<Accounts navigate={navigate} />);

    const backButton = screen.getByText('Atrás');
    userEvent.click(backButton);

    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });

  test('should call navigation callback when logout button is pressed', async () => {
    render(<Accounts navigate={navigate} />);

    navigate.mockClear();

    const backButton = screen.getByText('Salida segura');
    userEvent.click(backButton);

    expect(navigate.mock.calls.length).toBe(1);
    expect(navigate).toHaveBeenCalledWith('/logout');
  });

  test('should redirect to limits if an account is selected and save account info on session storage', async () => {
    const ress = JSON.stringify(getProductsResponse);
    server.use(
      rest.post('/api-gateway/products/get-all', (req, res, ctx) => {
        return res(ctx.text(btoa(ress)));
      })
    );
    render(<App navigate={navigate} />);

    await waitFor(() => screen.getAllByTestId('account-item'));
    const pulseItems = screen.getAllByTestId('account-item');

    fireEvent.click(pulseItems[0]);
    await waitFor(() => screen.getByTestId('limits-form-page'));

    // FIX: change bdbcrypt type with a generic
    const updateLimitState = (decrypt(sessionStorage.getItem(btoa('UpdateLimitState'))) as unknown) as UpdateLimitState;

    expect(updateLimitState.acctId).toEqual('0023051352');
    expect(updateLimitState.acctType).toEqual('DDA');
    expect(screen.getByTestId('limits-form-page')).toBeInTheDocument();
  });
});

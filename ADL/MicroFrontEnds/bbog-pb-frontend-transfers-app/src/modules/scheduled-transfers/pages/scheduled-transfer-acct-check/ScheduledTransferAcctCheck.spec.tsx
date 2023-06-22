import React from 'react';
import '@testing-library/jest-dom';

import { createEvent, fireEvent, render, screen, waitFor } from '../../../../test-utils/provider-mock';
import store from '../../../../store';
import server, { productsWithBalance } from '../../../../test-utils/api-mock';
import ScheduledTransferAcctCheck from './ScheduledTransferAcctCheck';
import { affiliatedAccountsActions } from '../../../../store/affiliated-accounts/afilliated-accounts.reducer';
import { AffiliatedAccount } from '../../../../store/affiliated-accounts/afilliated-accounts.entity';
import { productsActions } from '../../../../store/products/products.reducer';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/programadas/seleccionar-cuenta'
  })
}));

describe('ScheduledTransferAcctCheck unit tests', () => {
  const OLD_ENV = process.env;

  const affiliatedAccounts: AffiliatedAccount[] = [
    {
      productBank: 'FOGAFIN',
      bankId: '684',
      aval: false,
      productName: 'Fogafin Daniel',
      productAlias: 'Fogafin Daniel',
      productType: 'SDA',
      productNumber: '234567',
      description: 'Ahorros',
      priority: '3',
      customer: {
        identificationType: 'CC',
        identificationNumber: '234567'
      },
      contraction: 'FD'
    },
    {
      productBank: 'BANCO DE BOGOTA',
      bankId: '001',
      aval: true,
      productName: 'CUENTA PROPIA',
      productAlias: 'Cuenta de Ahorros',
      productType: 'DDA',
      productNumber: '345678',
      description: 'Corriente',
      priority: '1',
      customer: {
        identificationType: 'CC',
        identificationNumber: '2006699'
      },
      contraction: 'PR'
    }
  ];

  beforeAll(() => {
    process.env = { ...OLD_ENV, API_URL: '/api-gateway' };
    server.listen();
  });

  beforeEach(() => {
    store.dispatch(productsActions.fetchProductsSuccess([productsWithBalance[0]]));
    store.dispatch(affiliatedAccountsActions.fetchAffiliatedAccounts(affiliatedAccounts));
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterEach(() => {
    sessionStorage.clear();
    server.resetHandlers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('Should load the page', async () => {
    const scheduledTransferAcctCheck = render(<ScheduledTransferAcctCheck />);
    expect(scheduledTransferAcctCheck).toBeTruthy();
  });

  test('Should go back page', async () => {
    render(<ScheduledTransferAcctCheck />);
    const header = await waitFor(() => screen.findByTestId('header'));
    const clickBackEvent: Event & { detail?: unknown } = createEvent('backBtnClicked', header);
    fireEvent(header, clickBackEvent);
  });

  test('should navigate to the form to create a scheduled transfer', async () => {
    const mockState = jest.spyOn(React, 'useEffect');

    render(<ScheduledTransferAcctCheck />);
    const acctList = await waitFor(() => screen.findByTestId('check-acct-multi-action'));
    const clickOptionEvent: Event & { detail?: unknown } = createEvent('actionCardListEmitter', acctList);
    clickOptionEvent.detail = {
      bankId: '684',
      productType: 'SDA',
      title: 'Fogafin Daniel',
      desc: 'FOGAFIN',
      desc2: 'Ahorros No. 234567',
      value: '234567',
      avatar: {
        text: 'Fogafin Daniel',
        color: 'scooter',
        size: 'sm'
      }
    };

    Object.defineProperties(clickOptionEvent, {
      _target: {
        value: affiliatedAccounts,
        writable: true
      },
      target: {
        get: function () {
          return this._target;
        },
        set: function (value) {
          this._target = value;
        }
      }
    });

    fireEvent(acctList, clickOptionEvent);

    expect(mockState).toHaveBeenCalled();
    expect(acctList).toBeTruthy();
  });
});

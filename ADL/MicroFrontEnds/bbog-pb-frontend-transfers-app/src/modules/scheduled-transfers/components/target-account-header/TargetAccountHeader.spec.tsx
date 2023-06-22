import React from 'react';
import '@testing-library/jest-dom';
import store from '../../../../store';
import server from '../../../../test-utils/api-mock';
import TargetAccountHeader from './TargetAccountHeader';
import { render, screen } from '../../../../test-utils/provider-mock';
import { targetAccountActions } from '../../store/targetAccount/target-account.reducer';

describe('TargetAccountHeader', () => {
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

  test('should render TargetAccountHeader component', () => {
    const targetAccountHeader = render(<TargetAccountHeader />);
    expect(targetAccountHeader).toBeTruthy();
  });

  test('should display targetAccount data', () => {
    store.dispatch(
      targetAccountActions.setTargetAccount({
        accountAlias: 'Mama',
        bankName: 'Banco de Bogota',
        accountType: 'SDA',
        accountId: '12345678',
        bankId: '1001',
        isAval: true
      })
    );
    render(<TargetAccountHeader />);
    expect(screen.queryByText(/Mama/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cuenta de Ahorros No. 12345678/i)).toBeInTheDocument();
    expect(screen.queryByText(/Banco de Bogota/i)).toBeInTheDocument();
  });
});

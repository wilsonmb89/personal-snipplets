import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import CashAdvanceSummary from './CashAdvanceSummary';
import store from '@store/index';
import { act, screen, render, waitFor } from '@test-utils/provider-mock';
import { cashAdvanceWorkflowActions } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.reducer';
import { DEFAULT_TRANSACTION_COST } from '@cash-advance/constants/utilsConstants';

describe('CashAdvanceSummary component unit tests', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    store.dispatch(
      cashAdvanceWorkflowActions.setCardSelected({
        productName: 'Tarjeta de Crédito Platinum',
        description: 'TC. Platinum Marcas Compartida',
        officeId: '',
        productAthType: 'CB',
        productBankType: 'CCA',
        productBankSubType: '403722TC',
        productNumber: '4037220001907925',
        status: 'A',
        bin: '403722',
        valid: true,
        franchise: 'Visa',
        openDate: '2019-08-26',
        balanceInfo: {
          accountId: '4037220001907925',
          accountType: 'CCA',
          balanceDetail: {
            CashAvail: '5844092.00',
            CreditLimit: '10000000.00',
            AvailCredit: '9844092.00',
            PayoffAmt: '155908.00',
            Principal: '9844092.00'
          },
          minPmtCurAmt: '0.00'
        }
      })
    );
    store.dispatch(cashAdvanceWorkflowActions.setAdvanceAmount(`$ ${DEFAULT_TRANSACTION_COST}`));
    store.dispatch(
      cashAdvanceWorkflowActions.setDestinationAcct({
        productName: 'Cuenta de Ahorros LibreAhorro',
        description: 'AH Cuota Administración',
        officeId: '0019',
        productAthType: 'ST',
        productBankType: 'SDA',
        productBankSubType: '061AH',
        productNumber: '0019904804',
        status: 'A',
        valid: true,
        franchise: '',
        openDate: '2021-02-24',
        balanceInfo: {
          accountId: '0000000019904804',
          accountType: 'SDA',
          status: '00',
          balanceDetail: {
            Avail: '849000.93',
            CashAvail: '0.00',
            PendAuthAmt: '0.00',
            CashLimit: '0.00',
            Current: '12410051.93'
          }
        }
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('should load the component successfully', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceSummary />
        </Provider>
      );
    });
    const element = (await waitFor(() => screen.getByTestId('cash-advance-summary'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
  });

  test('should load the mastercard logo', async () => {
    store.dispatch(
      cashAdvanceWorkflowActions.setCardSelected({
        productName: 'Tarjeta de Crédito Platinum',
        description: 'TC. Platinum Marcas Compartida',
        officeId: '',
        productAthType: 'CB',
        productBankType: 'CCA',
        productBankSubType: '403722TC',
        productNumber: '4037220001907925',
        status: 'A',
        bin: '403722',
        valid: true,
        franchise: 'Mastercard',
        openDate: '2019-08-26',
        balanceInfo: {
          accountId: '4037220001907925',
          accountType: 'CCA',
          balanceDetail: {
            CashAvail: '5844092.00',
            CreditLimit: '10000000.00',
            AvailCredit: '9844092.00',
            PayoffAmt: '155908.00',
            Principal: '9844092.00'
          },
          minPmtCurAmt: '0.00'
        }
      })
    );
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceSummary />
        </Provider>
      );
    });
    const element = (await waitFor(() => screen.getByTestId('cash-advance-summary'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
  });

  test('should load the default logo', async () => {
    store.dispatch(
      cashAdvanceWorkflowActions.setCardSelected({
        productName: 'Tarjeta de Crédito Platinum',
        description: 'TC. Platinum Marcas Compartida',
        officeId: '',
        productAthType: 'CB',
        productBankType: 'CCA',
        productBankSubType: '403722TC',
        productNumber: '4037220001907925',
        status: 'A',
        bin: '403722',
        valid: true,
        franchise: 'Mastercard__',
        openDate: '2019-08-26',
        balanceInfo: {
          accountId: '4037220001907925',
          accountType: 'CCA',
          balanceDetail: {
            CashAvail: '5844092.00',
            CreditLimit: '10000000.00',
            AvailCredit: '9844092.00',
            PayoffAmt: '155908.00',
            Principal: '9844092.00'
          },
          minPmtCurAmt: '0.00'
        }
      })
    );
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceSummary />
        </Provider>
      );
    });
    const element = (await waitFor(() => screen.getByTestId('cash-advance-summary'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
  });

  test('should load component with default data', async () => {
    store.dispatch(
      cashAdvanceWorkflowActions.setCardSelected({
        productName: 'Tarjeta de Crédito Platinum',
        description: '',
        officeId: '',
        productAthType: 'CB',
        productBankType: 'CCA',
        productBankSubType: '403722TC',
        productNumber: '4037220001907925',
        status: 'A',
        bin: '403722',
        valid: true,
        franchise: 'Mastercard__',
        openDate: '2019-08-26',
        balanceInfo: {
          accountId: '4037220001907925',
          accountType: 'CCA',
          balanceDetail: {
            CashAvail: '5844092.00',
            CreditLimit: '10000000.00',
            AvailCredit: '9844092.00',
            PayoffAmt: '155908.00',
            Principal: '9844092.00'
          },
          minPmtCurAmt: '0.00'
        }
      })
    );
    store.dispatch(cashAdvanceWorkflowActions.setAdvanceAmount(''));
    store.dispatch(cashAdvanceWorkflowActions.setDestinationAcct(null));
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceSummary />
        </Provider>
      );
    });
    const element = (await waitFor(() => screen.getByTestId('cash-advance-summary'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
  });
});

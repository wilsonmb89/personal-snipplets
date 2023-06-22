import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import store from '@store/index';
import { encrypt } from '@avaldigitallabs/bbog-pb-lib-frontend-commons';
import { productsMock } from '@test-utils/modules/cash-advance/cashAdvaceTestUtils';
import { act, screen, render, waitFor, createEvent } from '@test-utils/provider-mock';
import CashAdvanceDestination from './CashAdvanceDestination';

describe('CashAdvanceDestination page unit tests', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    sessionStorage.setItem(btoa('ProductsState'), encrypt(productsMock));
  });

  afterEach(() => {
    jest.clearAllMocks();
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('should load page successfully', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceDestination />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('cash-advance-destination-container'));
    expect(element).toBeInTheDocument();
  });

  test('should select one item from accounts list', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceDestination />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('cash-advance-destination-container'));
    expect(element).toBeInTheDocument();
    const accountSelector = await waitFor(() => screen.getByTestId('account-selector'));
    expect(accountSelector).toBeInTheDocument();
    const event: Event & { detail?: unknown } = createEvent('cardSelected', element);
    event.detail = {
      cardName: 'Cuenta de Ahorros LibreAhorro',
      cardDescription2: 'No. 0019904804'
    };
    accountSelector.dispatchEvent(event);
    const {
      cashAdvanceWorkflowState: { destinationAcct }
    } = store.getState();
    expect(destinationAcct).not.toBeNull();
    const submitButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-destination-submit-button')
    )) as HTMLButtonElement;
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);
    const {
      destinationAcct: { productName, productNumber }
    } = store.getState().cashAdvanceWorkflowState;
    expect(productName).toBe('Cuenta de Ahorros LibreAhorro');
    expect(productNumber).toBe('0019904804');
  });
});

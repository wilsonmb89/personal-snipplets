import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import AccountsListSelector from './AccountsListSelector';
import store from '../../../../store';
import { act, screen, render, waitFor, createEvent } from '../../../../test-utils/provider-mock';
import { productsActions } from '../../../../store/products/products.reducer';
import {
  onlyProductAccountsListState,
  productsAccountsListState
} from '@test-utils/modules/cash-advance/cashAdvanceAccountsStateTestUtils';
import { cardsInfoActions } from '../../../../store/cards-info/cards-info.reducer';
import { cardsInfoMockData } from '@test-utils/modules/cash-advance/cashAdvaceTestUtils';

describe('AccountsListSelector component unit tests', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    store.dispatch(cardsInfoActions.fetchCardsInfoSuccess(cardsInfoMockData));
  });

  afterEach(() => {
    jest.clearAllMocks();
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('should load component successfully', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(productsAccountsListState));
    act(() => {
      render(
        <Provider store={store}>
          <AccountsListSelector />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('account-selector'));
    expect(element).toBeInTheDocument();
  });

  test('should load component with autoselected product', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(onlyProductAccountsListState));
    act(() => {
      render(
        <Provider store={store}>
          <AccountsListSelector />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('account-selector'));
    expect(element).toBeInTheDocument();
  });

  test('should select one item from the list', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(productsAccountsListState));
    act(() => {
      render(
        <Provider store={store}>
          <AccountsListSelector />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('account-selector'));
    expect(element).toBeInTheDocument();
    const event: Event & { detail?: unknown } = createEvent('cardSelected', element);
    event.detail = {
      cardName: 'Cuenta de Ahorros LibreAhorro',
      cardDescription2: 'No. 0019904804'
    };
    element.dispatchEvent(event);
    const {
      cashAdvanceWorkflowState: { destinationAcct }
    } = store.getState();
    expect(destinationAcct).not.toBeNull();
  });
});

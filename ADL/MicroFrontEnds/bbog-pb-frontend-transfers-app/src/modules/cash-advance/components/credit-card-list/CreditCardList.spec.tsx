import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import CreditCardList from './CreditCardList';
import store from '@store/index';
import { act, screen, render, waitFor, createEvent } from '@test-utils/provider-mock';
import { cardsInfoMockData, productsMock } from '@test-utils/modules/cash-advance/cashAdvaceTestUtils';
import { cardsInfoActions } from '@store/cards-info/cards-info.reducer';
import { productsActions } from '@store/products/products.reducer';

describe('CreditCardList component unit tests', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    store.dispatch(productsActions.fetchProductsSuccess(productsMock));
    store.dispatch(cardsInfoActions.fetchCardsInfoSuccess(cardsInfoMockData));
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
          <CreditCardList />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('check-credit-card-multi-action'));
    expect(element).toBeInTheDocument();
  });

  test('should set a selected credit card', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <CreditCardList />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('check-credit-card-multi-action'));
    const event: Event & { detail?: unknown } = createEvent('actionCardListEmitter', element);
    event.detail = {
      title: 'Tarjeta de Crédito Platinum',
      values: [
        {
          amount: '5522210168900044'
        }
      ]
    };
    element.dispatchEvent(event);
    const {
      cashAdvanceWorkflowState: { cardSelected }
    } = store.getState();
    expect(cardSelected).not.toBeNull();
  });
});

import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import store from '@store/index';
import CashAdvanceList from './CashAdvanceList';
import { cardsInfoMockData, productsMock } from '@test-utils/modules/cash-advance/cashAdvaceTestUtils';
import { act, screen, render, waitFor } from '@test-utils/provider-mock';
import { productsActions } from '@store/products/products.reducer';
import { cardsInfoActions } from '@store/cards-info/cards-info.reducer';

describe('CashAdvanceList page unit test', () => {
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

  test('should load the page succesfully', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceList />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.findByTestId('cash-advance-list-container'));
    expect(element).toBeInTheDocument();
  });
});

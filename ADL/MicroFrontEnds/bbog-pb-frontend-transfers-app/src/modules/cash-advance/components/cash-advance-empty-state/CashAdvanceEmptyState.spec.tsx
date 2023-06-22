import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import CashAdvanceEmptyState from './CashAdvanceEmptyState';
import Loader from '@components/core/loader/Loader';
import LayoutWrapper from '@components/core/layout-wrapper/LayoutWrapper';
import store from '@store/index';
import { act, screen, render, waitFor } from '@test-utils/provider-mock';
import {
  cardsInfoBlockedMockData,
  cardsInfoEmptyStateMockData,
  cardsInfoFrozenMockData,
  cardsInfoIndebtMockData,
  cardsInfoWrongPinMockData,
  productsEmptyState,
  productsLockedAccountEmptyState,
  productsNoAccountsEmptyState,
  productsNoFoundsEmptyState
} from '@test-utils/modules/cash-advance/cashAdvanceEmptyStateTestUtils';
import { productsActions } from '@store/products/products.reducer';
import { cardsInfoActions } from '@store/cards-info/cards-info.reducer';

describe('CashAdvanceEmptyState component unit tests', () => {
  const OLD_ENV = process.env;
  window.open = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  const getComponent = (): JSX.Element => {
    return (
      <Provider store={store}>
        <Suspense fallback={<Loader />}>
          <MemoryRouter initialEntries={['/avances']}>
            <Routes>
              <Route path="/" element={<LayoutWrapper />}>
                <Route path="avances/*" element={<CashAdvanceEmptyState />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </Suspense>
      </Provider>
    );
  };

  test('should load the component successfully with frozen credit card empty state', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(productsEmptyState));
    store.dispatch(cardsInfoActions.fetchCardsInfoSuccess(cardsInfoFrozenMockData));
    act(() => {
      render(getComponent());
    });
    await waitFor(() => screen.findByText('Tu tarjeta está congelada'));
    const element = (await waitFor(() => screen.getByTestId('cash-advance-empty-state'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
    const actionButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-empty-state-action-btn')
    )) as HTMLButtonElement;
    userEvent.click(actionButton);
  });

  test('should load the component successfully with no founds credit card empty state', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(productsNoFoundsEmptyState));
    store.dispatch(cardsInfoActions.fetchCardsInfoSuccess(cardsInfoEmptyStateMockData));
    act(() => {
      render(getComponent());
    });
    await waitFor(() => screen.findByText('No tienes cupo disponible en tu tarjeta'));
    const element = (await waitFor(() => screen.getByTestId('cash-advance-empty-state'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
    const actionButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-empty-state-action-btn')
    )) as HTMLButtonElement;
    userEvent.click(actionButton);
  });

  test('should load the component successfully with locked account empty state', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(productsLockedAccountEmptyState));
    store.dispatch(cardsInfoActions.fetchCardsInfoSuccess(cardsInfoEmptyStateMockData));
    act(() => {
      render(getComponent());
    });
    await waitFor(() => screen.findByText('Tu cuenta de ahorros está bloqueada'));
    const element = (await waitFor(() => screen.getByTestId('cash-advance-empty-state'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
    const actionButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-empty-state-action-btn')
    )) as HTMLButtonElement;
    userEvent.click(actionButton);
  });

  test('should load the component successfully with locked credit card empty state', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(productsEmptyState));
    store.dispatch(cardsInfoActions.fetchCardsInfoSuccess(cardsInfoBlockedMockData));
    act(() => {
      render(getComponent());
    });
    await waitFor(() => screen.findByText('Tu tarjeta está bloqueada'));
    const element = (await waitFor(() => screen.getByTestId('cash-advance-empty-state'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
    const actionButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-empty-state-action-btn')
    )) as HTMLButtonElement;
    userEvent.click(actionButton);
  });

  test('should load the component successfully with no accounts empty state', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(productsNoAccountsEmptyState));
    store.dispatch(cardsInfoActions.fetchCardsInfoSuccess(cardsInfoEmptyStateMockData));
    act(() => {
      render(getComponent());
    });
    await waitFor(() => screen.findByText('No tienes una cuenta de ahorros o corriente'));
    const element = (await waitFor(() => screen.getByTestId('cash-advance-empty-state'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
    const actionButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-empty-state-action-btn')
    )) as HTMLButtonElement;
    userEvent.click(actionButton);
  });

  test('should load the component successfully with indebt credit card empty state', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(productsEmptyState));
    store.dispatch(cardsInfoActions.fetchCardsInfoSuccess(cardsInfoIndebtMockData));
    act(() => {
      render(getComponent());
    });
    await waitFor(() => screen.findByText('Tu tarjeta se encuentra en mora'));
    const element = (await waitFor(() => screen.getByTestId('cash-advance-empty-state'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
    const actionButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-empty-state-action-btn')
    )) as HTMLButtonElement;
    userEvent.click(actionButton);
  });

  test('should load the component successfully with wrong pin credit card empty state', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(productsEmptyState));
    store.dispatch(cardsInfoActions.fetchCardsInfoSuccess(cardsInfoWrongPinMockData));
    act(() => {
      render(getComponent());
    });
    await waitFor(() => screen.findByText('Tu tarjeta tiene el pin errado'));
    const element = (await waitFor(() => screen.getByTestId('cash-advance-empty-state'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
    const actionButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-empty-state-action-btn')
    )) as HTMLButtonElement;
    userEvent.click(actionButton);
  });

  test('should load the component successfully with error empty state', async () => {
    store.dispatch(productsActions.fetchProductsSuccess(productsEmptyState));
    store.dispatch(cardsInfoActions.fetchCardsInfoError(new Error('TEST ERROR')));
    act(() => {
      render(getComponent());
    });
    await waitFor(() => screen.findByText('Hubo un error al cargar tus tarjetas'));
    const element = (await waitFor(() => screen.getByTestId('cash-advance-empty-state'))) as HTMLBdbMlResumeElement;
    expect(element).toBeInTheDocument();
    const actionButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-empty-state-action-btn')
    )) as HTMLButtonElement;
    userEvent.click(actionButton);
  });
});

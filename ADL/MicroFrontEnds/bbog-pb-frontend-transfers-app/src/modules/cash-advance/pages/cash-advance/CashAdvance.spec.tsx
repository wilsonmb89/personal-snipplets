import React, { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import store from '@store/index';
import server from '@test-utils/api-mock';
import { cardsInfoMockData, productsMock } from '@test-utils/modules/cash-advance/cashAdvaceTestUtils';
import { act, screen, render, waitFor, createEvent } from '@test-utils/provider-mock';
import { productsActions } from '@store/products/products.reducer';
import { CashAdvanceSteps } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.entity';
import { sherpaEvent } from '@test-utils/sherpa-event';
import { cardsInfoActions } from '@store/cards-info/cards-info.reducer';
import LayoutWrapper from '@components/core/layout-wrapper/LayoutWrapper';
import Loader from '@components/core/loader/Loader';
import CashAdvance from './CashAdvance';

describe('CashAdvanceList page unit test', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    sessionStorage.clear();
    store.dispatch(productsActions.fetchProductsSuccess(productsMock));
    store.dispatch(cardsInfoActions.fetchCardsInfoSuccess(cardsInfoMockData));
  });

  afterEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterAll(() => {
    process.env = OLD_ENV;
    server.close();
  });

  test('should load page successfully', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Suspense fallback={<Loader />}>
            <MemoryRouter initialEntries={['/avances']}>
              <Routes>
                <Route path="/" element={<LayoutWrapper />}>
                  <Route path="avances/*" element={<CashAdvance />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </Suspense>
        </Provider>
      );
    });
    const element = await waitFor(() => screen.findByTestId('cash-advance-list-container'));
    expect(element).toBeInTheDocument();
  });

  test('should navigate beetween cash advance pages', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Suspense fallback={<Loader />}>
            <MemoryRouter initialEntries={['/avances']}>
              <Routes>
                <Route path="/" element={<LayoutWrapper />}>
                  <Route path="avances/*" element={<CashAdvance />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </Suspense>
        </Provider>
      );
    });

    const listElement = await waitFor(() => screen.findByTestId('check-credit-card-multi-action'));
    expect(listElement).toBeInTheDocument();
    const listElementEvent: Event & { detail?: unknown } = createEvent('actionCardListEmitter', listElement);
    listElementEvent.detail = {
      title: 'Tarjeta de Crédito Platinum',
      values: [{ amount: '5522210168900044' }]
    };
    listElement.dispatchEvent(listElementEvent);
    const {
      cashAdvanceWorkflowState: { cardSelected, step }
    } = store.getState();
    expect(cardSelected).not.toBeNull();
    expect(step).toBe(CashAdvanceSteps.Amount);

    const amountElement = await waitFor(() => screen.getByTestId('cash-advance-amount-container'));
    expect(amountElement).toBeInTheDocument();
    const amountInput = (await waitFor(() => screen.getByTestId('cash-advance-amt'))) as HTMLBdbAtInputElement;
    expect(amountInput).toBeInTheDocument();
    const submitButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-amount-submit-button')
    )) as HTMLButtonElement;
    sherpaEvent.type(amountInput, { value: '10' });
    await waitFor(() => expect(!amountInput.message).toBeTruthy());
    await waitFor(() => expect(submitButton.disabled).toBeFalsy());
    userEvent.click(submitButton);
    const { advanceAmount } = store.getState().cashAdvanceWorkflowState;
    expect(advanceAmount).toBe('10');

    const destinationElement = await waitFor(() => screen.getByTestId('cash-advance-destination-container'));
    expect(destinationElement).toBeInTheDocument();
    const accountSelector = await waitFor(() => screen.getByTestId('account-selector'));
    expect(accountSelector).toBeInTheDocument();
    const destinationEvent: Event & { detail?: unknown } = createEvent('cardSelected', destinationElement);
    destinationEvent.detail = {
      cardName: 'Cuenta de Ahorros LibreAhorro',
      cardDescription2: 'No. 0019904804'
    };
    accountSelector.dispatchEvent(destinationEvent);
    const {
      cashAdvanceWorkflowState: { destinationAcct }
    } = store.getState();
    expect(destinationAcct).not.toBeNull();
    const destinationSubmitBtn = (await waitFor(() =>
      screen.getByTestId('cash-advance-destination-submit-button')
    )) as HTMLButtonElement;
    expect(destinationSubmitBtn).toBeInTheDocument();
    userEvent.click(destinationSubmitBtn);
    const {
      destinationAcct: { productName, productNumber }
    } = store.getState().cashAdvanceWorkflowState;
    expect(productName).toBe('Cuenta de Ahorros LibreAhorro');
    expect(productNumber).toBe('0019904804');

    const confirmElement = await waitFor(() => screen.getByTestId('cash-advance-confirmation'));
    expect(confirmElement).toBeInTheDocument();

    const headerElement = await waitFor(() => screen.getByTestId('cash-advance-header'));
    expect(headerElement).toBeInTheDocument();
    const headerElementEvent: Event & { detail?: unknown } = createEvent('backBtnClicked', headerElement);

    headerElement.dispatchEvent(headerElementEvent);
    expect(await waitFor(() => screen.getByTestId('cash-advance-destination-container')));

    headerElement.dispatchEvent(headerElementEvent);
    expect(await waitFor(() => screen.getByTestId('cash-advance-amount-container')));

    headerElement.dispatchEvent(headerElementEvent);
    expect(await waitFor(() => screen.getByTestId('check-credit-card-multi-action')));
  });

  test('should test the critical path', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Suspense fallback={<Loader />}>
            <MemoryRouter initialEntries={['/avances']}>
              <Routes>
                <Route path="/" element={<LayoutWrapper />}>
                  <Route path="avances/*" element={<CashAdvance />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </Suspense>
        </Provider>
      );
    });

    const listElement = await waitFor(() => screen.findByTestId('check-credit-card-multi-action'));
    expect(listElement).toBeInTheDocument();
    const listElementEvent: Event & { detail?: unknown } = createEvent('actionCardListEmitter', listElement);
    listElementEvent.detail = {
      title: 'Tarjeta de Crédito Platinum',
      values: [{ amount: '5522210168900044' }]
    };
    listElement.dispatchEvent(listElementEvent);
    const {
      cashAdvanceWorkflowState: { cardSelected, step }
    } = store.getState();
    expect(cardSelected).not.toBeNull();
    expect(step).toBe(CashAdvanceSteps.Amount);

    const amountElement = await waitFor(() => screen.getByTestId('cash-advance-amount-container'));
    expect(amountElement).toBeInTheDocument();
    const amountInput = (await waitFor(() => screen.getByTestId('cash-advance-amt'))) as HTMLBdbAtInputElement;
    expect(amountInput).toBeInTheDocument();
    const submitButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-amount-submit-button')
    )) as HTMLButtonElement;
    sherpaEvent.type(amountInput, { value: '10' });
    await waitFor(() => expect(!amountInput.message).toBeTruthy());
    await waitFor(() => expect(submitButton.disabled).toBeFalsy());
    userEvent.click(submitButton);
    const { advanceAmount } = store.getState().cashAdvanceWorkflowState;
    expect(advanceAmount).toBe('10');

    const destinationElement = await waitFor(() => screen.getByTestId('cash-advance-destination-container'));
    expect(destinationElement).toBeInTheDocument();
    const accountSelector = await waitFor(() => screen.getByTestId('account-selector'));
    expect(accountSelector).toBeInTheDocument();
    const destinationEvent: Event & { detail?: unknown } = createEvent('cardSelected', destinationElement);
    destinationEvent.detail = {
      cardName: 'Cuenta de Ahorros LibreAhorro',
      cardDescription2: 'No. 0019904804'
    };
    accountSelector.dispatchEvent(destinationEvent);
    const {
      cashAdvanceWorkflowState: { destinationAcct }
    } = store.getState();
    expect(destinationAcct).not.toBeNull();
    const destinationSubmitBtn = (await waitFor(() =>
      screen.getByTestId('cash-advance-destination-submit-button')
    )) as HTMLButtonElement;
    expect(destinationSubmitBtn).toBeInTheDocument();
    userEvent.click(destinationSubmitBtn);
    const {
      destinationAcct: { productName, productNumber }
    } = store.getState().cashAdvanceWorkflowState;
    expect(productName).toBe('Cuenta de Ahorros LibreAhorro');
    expect(productNumber).toBe('0019904804');

    const confirmElement = await waitFor(() => screen.getByTestId('cash-advance-confirmation'));
    expect(confirmElement).toBeInTheDocument();
    const confirmEvent: Event & { detail?: unknown } = createEvent('clickButton', confirmElement);
    confirmElement.dispatchEvent(confirmEvent);
    expect(await waitFor(() => screen.getByTestId('cash-advance-voucher'), { timeout: 3000 }));

    const headerElement = await waitFor(() => screen.getByTestId('cash-advance-header'));
    expect(headerElement).toBeInTheDocument();
    const headerElementEvent: Event & { detail?: unknown } = createEvent('forwardBtnClicked', headerElement);
    headerElement.dispatchEvent(headerElementEvent);
    const {
      cashAdvanceWorkflowState: { step: stepEnd }
    } = store.getState();
    expect(stepEnd).toBe(CashAdvanceSteps.List);
  });

  test('should abort the cash advance workflow', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <Suspense fallback={<Loader />}>
            <MemoryRouter initialEntries={['/avances']}>
              <Routes>
                <Route path="/" element={<LayoutWrapper />}>
                  <Route path="avances/*" element={<CashAdvance />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </Suspense>
        </Provider>
      );
    });

    const listElement = await waitFor(() => screen.findByTestId('check-credit-card-multi-action'));
    expect(listElement).toBeInTheDocument();
    const listElementEvent: Event & { detail?: unknown } = createEvent('actionCardListEmitter', listElement);
    listElementEvent.detail = {
      title: 'Tarjeta de Crédito Platinum',
      values: [{ amount: '5522210168900044' }]
    };
    listElement.dispatchEvent(listElementEvent);
    const {
      cashAdvanceWorkflowState: { cardSelected, step }
    } = store.getState();
    expect(cardSelected).not.toBeNull();
    expect(step).toBe(CashAdvanceSteps.Amount);

    const amountElement = await waitFor(() => screen.getByTestId('cash-advance-amount-container'));
    expect(amountElement).toBeInTheDocument();

    const headerElement = await waitFor(() => screen.getByTestId('cash-advance-header'));
    expect(headerElement).toBeInTheDocument();
    const headerElementEvent: Event & { detail?: unknown } = createEvent('forwardBtnClicked', headerElement);
    headerElement.dispatchEvent(headerElementEvent);

    const modalElement = await waitFor(() => screen.getByTestId('notification-modal'));
    expect(modalElement).toBeInTheDocument();
    const modalEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modalElement);
    modalEvent.detail = {
      value: 'Si, abandonar'
    };
    modalElement.dispatchEvent(modalEvent);
    expect(store.getState().cashAdvanceWorkflowState.step).toBe(CashAdvanceSteps.List);
  });

  test('should load page successfully with error message', async () => {
    store.dispatch(cardsInfoActions.fetchCardsInfoError(new Error('TEST ERROR')));
    act(() => {
      render(
        <Provider store={store}>
          <Suspense fallback={<Loader />}>
            <MemoryRouter initialEntries={['/avances']}>
              <Routes>
                <Route path="/" element={<LayoutWrapper />}>
                  <Route path="avances/*" element={<CashAdvance />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </Suspense>
        </Provider>
      );
    });
    const element = await waitFor(() => screen.findByTestId('notification-modal'));
    expect(element).toBeInTheDocument();
    const event: Event & { detail?: unknown } = createEvent('buttonAlertClicked', element);
    event.detail = {
      value: 'Cerrar'
    };
    element.dispatchEvent(event);
    await waitFor(() => expect(element).not.toBeInTheDocument());
  });
});

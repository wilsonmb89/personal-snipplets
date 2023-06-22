import React, { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import store from '@store/index';
import server from '@test-utils/api-mock';
import { act, screen, render, waitFor, createEvent } from '@test-utils/provider-mock';
import { cashAdvanceWorkflowActions } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.reducer';
import { CashAdvanceSteps } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.entity';
import {
  confirmCardSelected,
  confirmDestinationAmount
} from '@test-utils/modules/cash-advance/CashAdvanceConfirmUtils';
import { rest } from 'msw';
import CashAdvanceResult from './CashAdvanceResult';
import Loader from '@components/core/loader/Loader';
import LayoutWrapper from '@components/core/layout-wrapper/LayoutWrapper';
import { DEFAULT_TRANSACTION_COST } from '@cash-advance/constants/utilsConstants';

describe('CashAdvanceList page unit test', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    store.dispatch(cashAdvanceWorkflowActions.setCardSelected(confirmCardSelected));
    store.dispatch(cashAdvanceWorkflowActions.setAdvanceAmount('1000'));
    store.dispatch(cashAdvanceWorkflowActions.setDestinationAcct(confirmDestinationAmount));
    store.dispatch(cashAdvanceWorkflowActions.setTransactionCost(`$ ${DEFAULT_TRANSACTION_COST}`));
    store.dispatch(cashAdvanceWorkflowActions.setStep(CashAdvanceSteps.Confirm));
    server.listen();
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

  test('should load the page successfully', async () => {
    store.dispatch(
      cashAdvanceWorkflowActions.setFetchApiSuccess({
        message: 'Operation success',
        approvalId: '12345',
        requestId: '12345'
      })
    );
    act(() => {
      render(
        <Provider store={store}>
          <Suspense fallback={<Loader />}>
            <MemoryRouter initialEntries={['/avances']}>
              <Routes>
                <Route path="/" element={<LayoutWrapper />}>
                  <Route path="avances/*" element={<CashAdvanceResult />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </Suspense>
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('cash-advance-voucher'));
    expect(element).toBeInTheDocument();

    const event: Event & { detail?: unknown } = createEvent('buttonOk', element);
    element.dispatchEvent(event);
    const {
      cashAdvanceWorkflowState: { step }
    } = store.getState();
    expect(step).toBe(CashAdvanceSteps.List);
  });

  test('should retry 3 times a cash advance', async () => {
    store.dispatch(
      cashAdvanceWorkflowActions.setFetchApiError({
        message: 'Test Error',
        name: 'Error Test'
      })
    );
    server.use(
      rest.post('/api-gateway/internal-transfer/credit-card-advance/add', (_req, res, ctx) => {
        return res(ctx.status(409));
      })
    );
    act(() => {
      render(
        <Provider store={store}>
          <Suspense fallback={<Loader />}>
            <MemoryRouter initialEntries={['/avances']}>
              <Routes>
                <Route path="/" element={<LayoutWrapper />}>
                  <Route path="avances/*" element={<CashAdvanceResult />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </Suspense>
        </Provider>
      );
    });
    const element = (await waitFor(() => screen.getByTestId('cash-advance-voucher'))) as HTMLBdbMlBmVoucherElement;
    expect(element).toBeInTheDocument();
    const event: Event & { detail?: unknown } = createEvent('buttonOk', element);
    element.dispatchEvent(event);
    expect(element.buttonLabel).toBe('Intentar de nuevo');

    element.dispatchEvent(event);
    expect(element.buttonLabel).toBe('Intentar de nuevo');

    element.dispatchEvent(event);
    expect(element.buttonLabel).toBe('Entendido');

    element.dispatchEvent(event);
    const {
      cashAdvanceWorkflowState: { step }
    } = store.getState();
    expect(step).toBe(CashAdvanceSteps.List);
  });
});

import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';

import store from '@store/index';
import { act, screen, render, waitFor, createEvent } from '@test-utils/provider-mock';
import { cashAdvanceWorkflowActions } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.reducer';
import {
  confirmCardSelected,
  confirmDestinationAmount
} from '@test-utils/modules/cash-advance/CashAdvanceConfirmUtils';
import { CashAdvanceSteps } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.entity';
import CashAdvanceConfirm from './CashAdvanceConfirm';
import { DEFAULT_TRANSACTION_COST } from '@cash-advance/constants/utilsConstants';

describe('CashAdvanceConfirm page unit tests', () => {
  const OLD_ENV = process.env;
  const reference = { current: null };
  Object.defineProperty(reference, 'current', {
    get: jest.fn(() => null),
    set: jest.fn(() => null)
  });

  beforeAll(() => {
    store.dispatch(cashAdvanceWorkflowActions.setCardSelected(confirmCardSelected));
    store.dispatch(cashAdvanceWorkflowActions.setAdvanceAmount('1000'));
    store.dispatch(cashAdvanceWorkflowActions.setDestinationAcct(confirmDestinationAmount));
    store.dispatch(cashAdvanceWorkflowActions.setTransactionCost(`$ ${DEFAULT_TRANSACTION_COST}`));
    store.dispatch(cashAdvanceWorkflowActions.setStep(CashAdvanceSteps.Confirm));
  });

  afterEach(() => {
    jest.clearAllMocks();
    store.dispatch({ type: 'UNMOUNT' });
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('should load the page successfully', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceConfirm />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('cash-advance-confirmation'));
    expect(element).toBeInTheDocument();
  });

  test('should check the edit buttons', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceConfirm />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('cash-advance-confirmation'));
    expect(element).toBeInTheDocument();

    const event: Event & { detail?: unknown } = createEvent('editClickButton', element);
    event.detail = {
      card: {
        id: '1'
      }
    };
    element.dispatchEvent(event);
    const {
      cashAdvanceWorkflowState: { step }
    } = store.getState();
    expect(step).toBe(CashAdvanceSteps.Amount);
  });

  test('should check the go to credit card list warning modal', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceConfirm />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('cash-advance-confirmation'));
    expect(element).toBeInTheDocument();

    const event: Event & { detail?: unknown } = createEvent('editClickButton', element);
    event.detail = {
      card: {
        id: '0'
      }
    };
    element.dispatchEvent(event);
    const modal = await waitFor(() => screen.getByTestId('notification-modal'));
    expect(modal).toBeInTheDocument();
    const modalEvent: Event & { detail?: unknown } = createEvent('buttonAlertClicked', modal);
    modalEvent.detail = {
      value: 'Si, editar'
    };
    modal.dispatchEvent(modalEvent);
    const {
      cashAdvanceWorkflowState: { step }
    } = store.getState();
    expect(step).toBe(CashAdvanceSteps.List);
  });

  test('should confirm data to call cash advance method', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceConfirm />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('cash-advance-confirmation'));
    expect(element).toBeInTheDocument();

    const event: Event & { detail?: unknown } = createEvent('clickButton', element);
    element.dispatchEvent(event);
  });
});

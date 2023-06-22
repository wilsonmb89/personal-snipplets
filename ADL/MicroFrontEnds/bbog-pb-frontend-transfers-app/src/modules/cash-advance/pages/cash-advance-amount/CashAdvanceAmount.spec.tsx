import React from 'react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import CashAdvanceAmount from './CashAdvanceAmount';
import store from '@store/index';
import { cashAdvanceWorkflowActions } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.reducer';
import { cardSelected } from '@test-utils/modules/cash-advance/cashAdvanceAmountTestUtils';
import { act, screen, render, waitFor } from '@test-utils/provider-mock';
import { sherpaEvent } from '@test-utils/sherpa-event';

describe('CashAdvanceAmount page unit tests', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    store.dispatch(cashAdvanceWorkflowActions.setCardSelected(cardSelected));
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
          <CashAdvanceAmount />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('cash-advance-amount-container'));
    expect(element).toBeInTheDocument();
  });

  test('should validate the min and max values in amount input', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceAmount />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('cash-advance-amount-container'));
    expect(element).toBeInTheDocument();
    const amountInput = (await waitFor(() => screen.getByTestId('cash-advance-amt'))) as HTMLBdbAtInputElement;
    expect(amountInput).toBeInTheDocument();
    const submitButton = (await waitFor(() =>
      screen.getByTestId('cash-advance-amount-submit-button')
    )) as HTMLButtonElement;

    sherpaEvent.type(amountInput, { value: '50000000' });
    await waitFor(() =>
      expect(amountInput.message.indexOf('Cupo de avances insuficiente, tu cupo es') !== -1).toBeTruthy()
    );
    await waitFor(() => expect(submitButton.disabled).toBeTruthy());

    sherpaEvent.type(amountInput, { value: '0' });
    await waitFor(() =>
      expect(amountInput.message.indexOf('El valor del avance deber ser mayor a $0,1') !== -1).toBeTruthy()
    );
    await waitFor(() => expect(submitButton.disabled).toBeTruthy());

    sherpaEvent.type(amountInput, { value: '10' });
    await waitFor(() => expect(!amountInput.message).toBeTruthy());
    await waitFor(() => expect(submitButton.disabled).toBeFalsy());
  });

  test('should submit the form successfuly', async () => {
    act(() => {
      render(
        <Provider store={store}>
          <CashAdvanceAmount />
        </Provider>
      );
    });
    const element = await waitFor(() => screen.getByTestId('cash-advance-amount-container'));
    expect(element).toBeInTheDocument();
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
  });
});

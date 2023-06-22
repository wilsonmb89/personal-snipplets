import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CashAdvanceSteps, initialState } from './cash-advance-workflow.entity';
import { sessionStorageReducer } from '@store/session-storage.reducer';
import { Product } from '@store/products/products.entity';
import { CashAdvanceRs } from '../cash-advance/cash-advance.entity';

export const cashAdvanceWorkflowState = createSlice({
  name: 'CashAdvanceWorkflowState',
  initialState,
  reducers: {
    setTransactionCost(state, { payload }: PayloadAction<string>) {
      return {
        ...state,
        transactionCost: payload
      };
    },
    setStep(state, { payload }: PayloadAction<CashAdvanceSteps>) {
      return {
        ...state,
        step: payload
      };
    },
    setCardSelected(state, { payload }: PayloadAction<Product>) {
      return {
        ...state,
        cardSelected: payload
      };
    },
    setAdvanceAmount(state, { payload }: PayloadAction<string>) {
      return {
        ...state,
        advanceAmount: payload
      };
    },
    setDestinationAcct(state, { payload }: PayloadAction<Product>) {
      return {
        ...state,
        destinationAcct: payload
      };
    },
    setFetchApiSuccess(state, { payload }: PayloadAction<CashAdvanceRs>) {
      return {
        ...state,
        fetchApiResult: {
          success: payload,
          error: null
        }
      };
    },
    setFetchApiError(state, { payload }: PayloadAction<Error>) {
      return {
        ...state,
        fetchApiResult: {
          success: null,
          error: {
            ...state.fetchApiResult?.error,
            data: payload
          }
        }
      };
    },
    setErrorAttempt(state) {
      return {
        ...state,
        fetchApiResult: {
          success: null,
          error: {
            ...state.fetchApiResult?.error,
            attemps: state.fetchApiResult?.error.attemps + 1
          }
        }
      };
    },
    reset() {
      return { ...initialState };
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'CashAdvanceWorkflowState', [
      'setTransactionCost',
      'setStep',
      'setCardSelected',
      'setAdvanceAmount',
      'setDestinationAcct',
      'setFetchApiSuccess',
      'setFetchApiError',
      'setErrorAttempt',
      'reset'
    ]);
  }
});

export const cashAdvanceWorkflowActions = cashAdvanceWorkflowState.actions;

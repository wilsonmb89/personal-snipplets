import { Dispatch } from '@reduxjs/toolkit';

import { RootState } from '@store/index';
import { loadingHandler } from '@store/loader/loader.store';
import { CashAdvanceWorkflowData } from '../cash-advance-workflow/cash-advance-workflow.entity';
import { CashAdvanceRq } from './cash-advance.entity';
import { BANK_INFO } from '@constants/bank-codes';
import { cashAdvanceApi } from './cash-advance.api';
import { cashAdvanceWorkflowActions } from '../cash-advance-workflow/cash-advance-workflow.reducer';
import { currencyToNumberSherpa } from '@utils/currency.utils';

const buildCashAvanceRq = (cashAdvanceWorkflowState: CashAdvanceWorkflowData): CashAdvanceRq => {
  const { cardSelected, destinationAcct, advanceAmount } = cashAdvanceWorkflowState;
  return {
    card: {
      id: cardSelected.productNumber,
      type: cardSelected.productBankType,
      brand: cardSelected.franchise.toUpperCase()
    },
    account: {
      id: destinationAcct.productNumber,
      type: destinationAcct.productBankType,
      subType: destinationAcct.productBankSubType,
      bankId: BANK_INFO.BBOG.bankId
    },
    amount: currencyToNumberSherpa(advanceAmount)
  };
};

export const fetchCashAdvance = (): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    try {
      const { cashAdvanceWorkflowState } = getState();
      const cashAdvanceRq = buildCashAvanceRq(cashAdvanceWorkflowState);
      const cashAdvanceRs = await cashAdvanceApi(cashAdvanceRq);
      dispatch(cashAdvanceWorkflowActions.setFetchApiSuccess(cashAdvanceRs));
    } catch (error) {
      dispatch(cashAdvanceWorkflowActions.setFetchApiError(error));
      dispatch(cashAdvanceWorkflowActions.setErrorAttempt());
      throw error;
    }
  };
  return loadingHandler.bind(null, fetch);
};

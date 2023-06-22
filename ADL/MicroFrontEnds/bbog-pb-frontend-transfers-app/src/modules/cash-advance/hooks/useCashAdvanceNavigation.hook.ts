import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CashAdvancePages, getNavigationPath } from '../constants/navigationPaths';
import { CashAdvanceSteps } from '../store/cash-advance-workflow/cash-advance-workflow.entity';
import { cashAdvanceWorkflowActions } from '../store/cash-advance-workflow/cash-advance-workflow.reducer';
import { externalNavigate } from '@store/shell-events/shell-events.store';
import { useCashAdvanceWorkFlow } from './useCashAdvanceWorkflow.hook';

interface CashAdvanceNavigationProps {
  onBackClickHandler: () => void;
  rootRedirect: () => void;
}

export const useCashAdvanceNavigation = (): CashAdvanceNavigationProps => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { step, directAccess } = useCashAdvanceWorkFlow();

  const navigatePage = (): void => {
    let page: CashAdvancePages;
    switch (step) {
      case CashAdvanceSteps.Amount:
        page = CashAdvancePages.CASH_ADVANCE_AMOUNT;
        break;
      case CashAdvanceSteps.Destination:
        page = CashAdvancePages.CASH_ADVANCE_DESTINATION;
        break;
      case CashAdvanceSteps.Confirm:
        page = CashAdvancePages.CASH_ADVANCE_CONFIRM;
        break;
      case CashAdvanceSteps.Result:
        page = CashAdvancePages.CASH_ADVANCE_RESULT;
        break;
      default:
        page = CashAdvancePages.CASH_ADVANCE_LIST;
        break;
    }
    navigate(getNavigationPath(page));
  };

  useEffect(() => {
    navigatePage();
  }, [step]);

  const checkOnbackAmount = (): void => {
    if (!directAccess) {
      dispatch(cashAdvanceWorkflowActions.setCardSelected(null));
      dispatch(cashAdvanceWorkflowActions.setAdvanceAmount(null));
      dispatch(cashAdvanceWorkflowActions.setStep(CashAdvanceSteps.List));
    } else {
      rootRedirect();
    }
  };

  const checkOnbackDestination = (): void => {
    dispatch(cashAdvanceWorkflowActions.setDestinationAcct(null));
    dispatch(cashAdvanceWorkflowActions.setStep(CashAdvanceSteps.Amount));
  };

  const onBackClickHandler = (): void => {
    switch (step) {
      case CashAdvanceSteps.Amount:
        checkOnbackAmount();
        break;
      case CashAdvanceSteps.Destination:
        checkOnbackDestination();
        break;
      case CashAdvanceSteps.Confirm:
        dispatch(cashAdvanceWorkflowActions.setStep(CashAdvanceSteps.Destination));
        break;
      default:
        dispatch(cashAdvanceWorkflowActions.setStep(CashAdvanceSteps.List));
        break;
    }
  };

  const rootRedirect = () => {
    dispatch(cashAdvanceWorkflowActions.reset());
    if (directAccess) {
      dispatch(externalNavigate('/dashboard'));
    } else {
      dispatch(externalNavigate('/legacy/transfers/cashAdvance'));
    }
  };

  return { onBackClickHandler, rootRedirect };
};

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '@store/index';
import { cashAdvanceWorkflowSelector } from '../store/cash-advance-workflow/cash-advance-workflow.select';
import { cashAdvanceWorkflowActions } from '../store/cash-advance-workflow/cash-advance-workflow.reducer';
import {
  creditCardsCountSelector,
  creditCardsOrderedSelector,
  savingsProductsWithoutAFCSelector
} from '@store/products/products.select';
import { Product } from '@store/products/products.entity';
import { CashAdvanceSteps } from '../store/cash-advance-workflow/cash-advance-workflow.entity';
import { CREDIT_CARD_STATES } from '@constants/bank-codes';
import { cardsInfoSelector, customerCardListSelector } from '@store/cards-info/cards-info.select';
import { NotificationControl, NotificationData } from '../../../notification/Notification';
import showNotificationModal from '../../../notification';
import { balanceState } from '@store/balances/balance.select';

interface UseCashAdvanceWorkflowProps {
  step: CashAdvanceSteps;
  creditCards: Product[];
  creditCardsCount: number;
  creditCardSelected: Product;
  destinationAcctSelected: Product;
  emptyState: EmptyStateTypes;
  directAccess: boolean;

  setDestinationAcct: (account: Product) => void;
  setCreditCardSelected: (card: Product) => void;
  setWorkFlowStep: (step: CashAdvanceSteps) => void;
  showGenericError: () => void;
}

export type EmptyStateTypes =
  | 'ACT_LOCKED'
  | 'INSUFFICIENT'
  | 'NO_ACCT'
  | 'CC_LOCKED'
  | 'FROZEN'
  | 'INDEBT'
  | 'WRONG_PIN'
  | 'NO_DATA'
  | 'OK'
  | 'LOADING'
  | 'ERROR';

export const useCashAdvanceWorkFlow = (): UseCashAdvanceWorkflowProps => {
  const dispatch: AppDispatch = useDispatch();

  const creditCards = useSelector(creditCardsOrderedSelector);
  const creditCardsCount = useSelector(creditCardsCountSelector);
  const validAccounts = useSelector(savingsProductsWithoutAFCSelector);
  const {
    cardSelected: creditCardSelected,
    destinationAcct: destinationAcctSelected,
    step,
    directAccess
  } = useSelector(cashAdvanceWorkflowSelector);
  const cardsInfoList = useSelector(customerCardListSelector);
  const { error: balanceInquiryError } = useSelector(balanceState);
  const { error: cardsInfoError } = useSelector(cardsInfoSelector);

  const [emptyState, setEmptyState] = useState<EmptyStateTypes>('LOADING');

  useEffect(() => {
    if (balanceInquiryError || cardsInfoError) {
      setEmptyState('ERROR');
    } else {
      validateCreditCards();
    }
  }, [validAccounts, creditCards, cardsInfoList, balanceInquiryError, cardsInfoError]);

  const validateCreditCards = (): void => {
    const validAccountsCount = validAccounts?.length || 0;
    if (creditCards?.length > 0 && validAccountsCount > 0 && cardsInfoList?.length > 0) {
      if (creditCards?.length === 1) {
        const creditCard = creditCards[0];
        const { cardState } = cardsInfoList.find(cardInfoP => cardInfoP.cardNumber === creditCard.productNumber);
        if (cardState) {
          if (CREDIT_CARD_STATES.BLOCKED.includes(cardState)) {
            setEmptyState('CC_LOCKED');
            return;
          } else if (CREDIT_CARD_STATES.FROZEN.includes(cardState)) {
            setEmptyState('FROZEN');
            return;
          } else if (CREDIT_CARD_STATES.INDEBT.includes(cardState)) {
            setEmptyState('INDEBT');
            return;
          } else if (CREDIT_CARD_STATES.WRONG_PIN.includes(cardState)) {
            setEmptyState('WRONG_PIN');
            return;
          } else {
            const balanceDetail = creditCard.balanceInfo?.balanceDetail;
            if (balanceDetail && ['0', '0.0', '0.00'].includes(balanceDetail?.AvailCredit)) {
              setEmptyState('INSUFFICIENT');
              return;
            }
          }
        } else {
          setEmptyState('NO_DATA');
          return;
        }
      }
      if (validAccountsCount === 1) {
        const validAccount = validAccounts[0];
        if (!validAccount.valid) {
          setEmptyState('ACT_LOCKED');
          return;
        }
      }
      setEmptyState('OK');
    } else if (validAccountsCount > 0 && creditCards?.length === 0) {
      setEmptyState('NO_DATA');
    } else if (creditCards?.length > 0 && validAccountsCount === 0) {
      setEmptyState('NO_ACCT');
    } else {
      setEmptyState('ERROR');
    }
  };

  const setDestinationAcct = (account: Product): void => {
    dispatch(cashAdvanceWorkflowActions.setDestinationAcct(account));
  };

  const setCreditCardSelected = (card: Product): void => {
    dispatch(cashAdvanceWorkflowActions.setCardSelected(card));
  };

  const setWorkFlowStep = (newStep: CashAdvanceSteps): void => {
    dispatch(cashAdvanceWorkflowActions.setStep(newStep));
  };

  const showGenericError = (): void => {
    const notificationDelete: NotificationData = {
      type: 'warning',
      name: '!Ups¡ algo salió mal',
      message: 'En este momento presentamos problemas con el servicio. Por favor inténtalo de nuevo.'
    };
    const deleteActions: NotificationControl[] = [{ text: 'Cerrar' }];
    showNotificationModal(notificationDelete, deleteActions);
  };

  return {
    creditCards,
    creditCardsCount,
    creditCardSelected,
    destinationAcctSelected,
    emptyState,
    step,
    directAccess,
    setDestinationAcct,
    setCreditCardSelected,
    setWorkFlowStep,
    showGenericError
  };
};

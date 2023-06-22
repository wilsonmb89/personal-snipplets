import { useEffect, useState } from 'react';

import defaultEmptyImage from '../../../assets/img/core/empty-states/new-account.svg';
import serviceError from '../../../assets/img/core/empty-states/service-error.svg';

import { EmptyStateTypes, useCashAdvanceWorkFlow } from './useCashAdvanceWorkflow.hook';
import { cashAdvanceEmptyStateUrl } from '../constants/externalPaths';
import { useCashAdvanceNavigation } from './useCashAdvanceNavigation.hook';
import { AppDispatch } from '@store/index';
import { useDispatch } from 'react-redux';
import { loadingActions } from '@store/loader/loader.store';
import { fetchProducts } from '@store/products/products.effect';
import { fetchCardsInfo } from '@store/cards-info/cards-info.effect';
import { cashAdvanceWorkflowActions } from '@cash-advance/store/cash-advance-workflow/cash-advance-workflow.reducer';
import { balanceActions } from '@store/balances/balance.reducer';
import { cardsInfoActions } from '@store/cards-info/cards-info.reducer';

interface EmptyStateProps {
  image: string;
  title?: string;
  description: string;
  button?: {
    action: () => void;
    label: string;
  };
}

const CALL_OFFICE_TEXT_CONST =
  'Por favor comunícate con nuestra servilínea o dirígete a una de nuestras oficinas para desbloquearla';
const GO_BACK_BTN_TEXT_CONST = 'Volver a mis productos';

export const useCashAdvanceEmptyState = (): EmptyStateProps => {
  const dispatch: AppDispatch = useDispatch();

  const { emptyState } = useCashAdvanceWorkFlow();
  const { rootRedirect } = useCashAdvanceNavigation();

  const [emptyStateData, setEmptyStateData] = useState<EmptyStateProps>(null);

  useEffect(() => {
    buildEmptyState(emptyState);
  }, [emptyState]);

  const fetchInitData = (): void => {
    resetData();
    dispatch(loadingActions.enable());
    Promise.all([
      dispatch(fetchProducts({ disableLoader: true })),
      dispatch(fetchCardsInfo({ disableLoader: true }))
    ]).finally(() => dispatch(loadingActions.disable()));
  };

  const resetData = (): void => {
    dispatch(balanceActions.reset());
    dispatch(cardsInfoActions.reset());
    dispatch(cashAdvanceWorkflowActions.reset());
  };

  const buildEmptyState = (emptyStateType: EmptyStateTypes): void => {
    switch (emptyStateType) {
      case 'NO_DATA':
        setEmptyStateData({
          image: defaultEmptyImage,
          title: '¡ Solicita tu tarjeta para realizar avances !',
          description: 'El dinero llegará a tu cuenta destino de inmediato.',
          button: {
            action: () => window.open(cashAdvanceEmptyStateUrl.REQUEST_CC_CARD),
            label: 'Solicitar tarjeta'
          }
        });
        break;
      case 'FROZEN':
        setEmptyStateData({
          image: defaultEmptyImage,
          title: 'Tu tarjeta está congelada',
          description: 'Para realizar un avance puedes descongelar tu tarjeta en nuestro portal',
          button: {
            action: () => rootRedirect(),
            label: 'Descongelar tarjeta'
          }
        });
        break;
      case 'CC_LOCKED':
        setEmptyStateData({
          image: defaultEmptyImage,
          title: 'Tu tarjeta está bloqueada',
          description: CALL_OFFICE_TEXT_CONST,
          button: {
            action: () => window.open(cashAdvanceEmptyStateUrl.SEARCH_OFFICES),
            label: 'Ver oficinas'
          }
        });
        break;
      case 'NO_ACCT':
        setEmptyStateData({
          image: defaultEmptyImage,
          title: 'No tienes una cuenta de ahorros o corriente',
          description: 'Solicítala para que podamos depósitar el dinero del avance en tu cuenta.',
          button: {
            action: () => window.open(cashAdvanceEmptyStateUrl.REQUST_SAVING_ACCT),
            label: 'Solicitar cuenta de ahorros'
          }
        });
        break;
      case 'INSUFFICIENT':
        setEmptyStateData({
          image: defaultEmptyImage,
          title: 'No tienes cupo disponible en tu tarjeta',
          description: 'Lo sentimos, el cupo disponible de tu tarjeta para avances es de $0',
          button: {
            action: () => rootRedirect(),
            label: GO_BACK_BTN_TEXT_CONST
          }
        });
        break;
      case 'ACT_LOCKED':
        setEmptyStateData({
          image: defaultEmptyImage,
          title: 'Tu cuenta de ahorros está bloqueada',
          description: CALL_OFFICE_TEXT_CONST,
          button: {
            action: () => rootRedirect(),
            label: GO_BACK_BTN_TEXT_CONST
          }
        });
        break;
      case 'INDEBT':
        setEmptyStateData({
          image: defaultEmptyImage,
          title: 'Tu tarjeta se encuentra en mora',
          description: CALL_OFFICE_TEXT_CONST,
          button: {
            action: () => rootRedirect(),
            label: GO_BACK_BTN_TEXT_CONST
          }
        });
        break;
      case 'WRONG_PIN':
        setEmptyStateData({
          image: defaultEmptyImage,
          title: 'Tu tarjeta tiene el pin errado',
          description: CALL_OFFICE_TEXT_CONST,
          button: {
            action: () => rootRedirect(),
            label: GO_BACK_BTN_TEXT_CONST
          }
        });
        break;
      case 'ERROR':
        setEmptyStateData({
          image: serviceError,
          title: '',
          description: 'Hubo un error al cargar tus tarjetas',
          button: {
            action: fetchInitData,
            label: 'Volver a cargar'
          }
        });
        break;
    }
  };

  return emptyStateData;
};

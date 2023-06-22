import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchAffiliatedAccountsList } from '../../../store/affiliated-accounts/afilliated-accounts.effect';
import {
  getCountOfAffiliatedAccounts,
  getValidAffiliatedAndProducts
} from '../../../store/affiliated-accounts/afilliated-accounts.select';
import {
  getCountOfAccountsWithoutAcfSelector,
  savingsProductsWithoutAFCSelector
} from '../../../store/products/products.select';
import { externalNavigate } from '../../../store/shell-events/shell-events.store';
import { getNavigationPath } from '../constants/navigation-paths';
import { fetchScheduleList } from '../store/list/scheduled-transfer-list.effect';
import { SchedulesCardDataI, getValidScheduleTransfersToList } from '../store/list/scheduled-transfer-list.select';

import newAccount from '../../../assets/img/core/empty-states/new-account.svg';
import registerAccount from '../../../assets/img/core/empty-states/register-account.svg';
import newTrasnferSchedule from '../../../assets/img/core/empty-states/new-transfer-schedule.svg';
import serviceError from '../../../assets/img/core/empty-states/service-error.svg';
import { AppDispatch } from '../../../store';
import { loadingActions } from '../../../store/loader/loader.store';
import { scheduledTransferListActions } from '../store/list/scheduled-transfer-list.reducer';
import { affiliatedAccountsActions } from '../../../store/affiliated-accounts/afilliated-accounts.reducer';

interface UseValidateView {
  getValidView: () => EmptyProperties;
  addScheduledTransferHandler: () => void;
  cardItems: SchedulesCardDataI[];
}

interface EmptyProperties {
  clickButton?(): void;
  clickLink?(): void;
  buttonDisabled?: boolean;
  buttonIcon?: string;
  buttonText: string;
  dataTestId: string;
  descr: string;
  descrLink?: string;
  img: string;
}

interface ViewsProperties {
  condition?: boolean;
  emptyProperties?: EmptyProperties;
}

export const useValidateView = (): UseValidateView => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const accountsLength: number = useSelector(getCountOfAccountsWithoutAcfSelector);
  const scheduledTransfers: SchedulesCardDataI[] = useSelector(getValidScheduleTransfersToList);
  const affiliatedAccountsLength: number = useSelector(getCountOfAffiliatedAccounts);
  const affiliatedAccounts = useSelector(getValidAffiliatedAndProducts);
  const validProducts = useSelector(savingsProductsWithoutAFCSelector);

  const [cardItems, setCardItems] = useState([]);

  const tryListScheduledTransfers = (): void => {
    dispatch(loadingActions.enable());
    dispatch(scheduledTransferListActions.reset());
    dispatch(affiliatedAccountsActions.reset());
    const fetchAll = Promise.all([
      dispatch(fetchScheduleList({ disableLoader: true })),
      dispatch(fetchAffiliatedAccountsList({ disableLoader: true }))
    ]);
    fetchAll.then(() => dispatch(loadingActions.disable())).catch(() => dispatch(loadingActions.disable()));
  };

  const addScheduledTransferHandler = (): void => {
    navigate(getNavigationPath('SCHEDULED_ACCT_CHECK', false));
  };

  const redirectNewAccount = (): void => {
    window.location.href = 'https://digital.bancodebogota.com/cuenta-ahorros';
  };

  const views: ViewsProperties[] = [
    {
      emptyProperties: {
        clickButton: tryListScheduledTransfers,
        buttonText: 'Volver a cargar',
        dataTestId: 'error-scheduled-transfers',
        descr: 'Hubo un error al cargar tus programaciones.',
        img: serviceError
      }
    },
    {
      condition: accountsLength === 0,
      emptyProperties: {
        clickButton: redirectNewAccount,
        buttonText: 'Abrir cuenta',
        dataTestId: 'not-own-accounts',
        descr: 'Para realizar transacciones, abre tu cuenta sin costo y lista para usar de inmediato.',
        img: newAccount
      }
    },
    {
      condition: accountsLength === 1 && affiliatedAccountsLength === 0,
      emptyProperties: {
        clickLink: () => dispatch(externalNavigate(-1)),
        buttonDisabled: true,
        buttonIcon: 'ico-add',
        buttonText: 'Nueva programación',
        dataTestId: 'not-affiliated-accounts',
        descr: 'Debes tener una cuenta inscrita. Inscríbela en la pestaña ',
        descrLink: 'Entre Cuentas',
        img: registerAccount
      }
    },
    {
      condition: cardItems.length === 0,
      emptyProperties: {
        clickButton: addScheduledTransferHandler,
        buttonIcon: 'ico-add',
        buttonText: 'Nueva programación',
        dataTestId: 'not-scheduled-transfer',
        descr: 'Programa tus transferencias y evita que se te olviden.',
        img: newTrasnferSchedule
      }
    }
  ];

  useEffect(() => {
    if (scheduledTransfers?.length > 0 && validProducts?.length > 0) {
      setCardItems([]);
      scheduledTransfers.forEach(scheduledCardData => addScheduledCard(scheduledCardData));
    }
  }, [scheduledTransfers, affiliatedAccounts, validProducts]);

  const getValidView = (): EmptyProperties => {
    if (scheduledTransfers && affiliatedAccountsLength !== null) {
      return views.find(item => item.condition)?.emptyProperties;
    }
    const [errorEmptyState] = views;
    return errorEmptyState.emptyProperties;
  };

  const addScheduledCard = (newItem: SchedulesCardDataI): void => {
    setCardItems(cardItemsAdded => [...cardItemsAdded, newItem]);
  };

  return { getValidView, addScheduledTransferHandler, cardItems };
};

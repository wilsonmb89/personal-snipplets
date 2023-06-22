import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getFirstProductSelector,
  productsCountSelector,
  productToAccount,
  savingsAccountsSelectorDropdown
} from '../../../store/products/products.select';
import { BdbAtDropdownModel } from '../../../components/sherpa/models/BdbAtDropdown.model';
import { getScheduleTransferSelected } from '../store/selected/scheduled-transfer-selected.select';
import { Account } from '../store/list/scheduled-transfer-list.entity';
import { getNavigationPath } from '../constants/navigation-paths';
import { externalNavigate } from '../../../store/shell-events/shell-events.store';
import { showToast } from '../../../store/toast/toast.store';

interface UseScheduledTransfer {
  accountsDropdown: BdbAtDropdownModel[];
  setAccountDefaultValue: () => string;
  getAccountFormValue: (account: Account) => string;
  rootScheduledAndShowToast: (message: string) => void;
}

const useQuery = () => new URLSearchParams(useLocation().search);

export const useScheduledTransfer = (): UseScheduledTransfer => {
  const navigate = useNavigate();
  const accountsDropdown = useSelector(savingsAccountsSelectorDropdown);
  const scheduleTransferSelected = useSelector(getScheduleTransferSelected);
  const productsCount = useSelector(productsCountSelector);
  const firstProduct = useSelector(getFirstProductSelector);
  const query = useQuery();

  const dispatch = useDispatch();

  const setAccountDefaultValue = (): string => {
    if (scheduleTransferSelected?.accountFrom?.acctId) {
      return getAccountFormValue(scheduleTransferSelected.accountFrom);
    }
    if (productsCount === 1) {
      return getAccountFormValue(productToAccount(firstProduct));
    }
    return '';
  };

  const getAccountFormValue = (account: Partial<Account>): string => {
    if (account && account.acctId && account.acctType) {
      return `${account.acctId}_${account.acctType}`;
    }
    return '';
  };

  const rootScheduledAndShowToast = (message?: string) => {
    const internal = query.get('internal');
    if (internal) {
      navigate(getNavigationPath('SCHEDULED_LIST', false));
      if (message) dispatch(showToast({ text: message, type: 'success' }));
    } else {
      dispatch(externalNavigate('/legacy/transfers/scheduled'));
      setTimeout(() => {
        navigate(getNavigationPath('SCHEDULED_LIST', false));
        if (message) dispatch(showToast({ text: message, type: 'success' }));
      }, 500);
    }
  };

  return { accountsDropdown, setAccountDefaultValue, getAccountFormValue, rootScheduledAndShowToast };
};

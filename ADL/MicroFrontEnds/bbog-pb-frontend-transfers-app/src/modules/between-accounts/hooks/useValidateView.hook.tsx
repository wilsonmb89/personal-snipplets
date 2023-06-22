import { useDispatch, useSelector } from 'react-redux';
import {
  getErrorAffiliated,
  getValidAffiliated,
  getValidAffiliatedAndProducts
} from '../../../store/affiliated-accounts/afilliated-accounts.select';
import {
  getErrorProducts,
  productsCountSelector,
  productsSelectorWithoutBalance,
  savingsProductsWithoutAFCSelector
} from '../../../store/products/products.select';

import newAccount from '../../../assets/img/core/empty-states/new-account.svg';
import serviceError from '../../../assets/img/core/empty-states/service-error.svg';

import { useEffect, useState } from 'react';
import { loadingActions } from '../../../store/loader/loader.store';
import { fetchProducts } from '../../../store/products/products.effect';
import { useAccountsList } from '../../../components/core/account-list/useAccountsList.hook';
import { optionsAffiliatedAccounts, optionsOwnAccount } from '../constants/options-menu';
import { fetchAffiliatedAccountsList } from '../../../store/affiliated-accounts/afilliated-accounts.effect';
import { useNavigate } from 'react-router-dom';
import { getNavigationPath, BetweenAccountPages } from '../constants/navigation-paths';
import { getNavigationPath as getNavigationPathScheduled } from '../../scheduled-transfers/constants/navigation-paths';
import { accountSelectActions } from '../store/selected/account-selected.reducer';
import { AffiliatedAccount } from '../../../store/affiliated-accounts/afilliated-accounts.entity';
import { getOwnAccountSelected } from '../store/selected/account-selected.select';
import { setTargetAccountByAccountSelected } from '../../scheduled-transfers/store/targetAccount/target-account.effect';
import { ScheduledTranfersPages } from '../../scheduled-transfers/constants/navigation-paths';
import { isEmpty } from 'lodash';
import { transferAccountActions } from '../store/transfer/account-transfer.reducer';
import { getTransferAccount } from '../store/transfer/account-transfer.select';
import { catalogsActions } from '../../../store/catalogs/catalogs.reducer';
import { getErrorCatalog } from '../../../store/catalogs/catalogs.select';
import { ProductType } from '../../../constants/bank-codes';
import { balanceDetail } from '../../../store/balances/balance.effect';
import { makeRequestForBalanceApi } from '@utils/utils';
import { isConsumed } from '../../../store/balances/balance.select';
import { balanceActions } from '../../../store/balances/balance.reducer';
import { AppDispatch } from '../../../store';
import { getAffiliatedAccountSelected } from '../../../store/affiliated-accounts/afilliated-accounts.select';
import { affiliatedAccountsActions } from '../../../store/affiliated-accounts/afilliated-accounts.reducer';
import { IAttributesCardList } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/types/components/sherpa-ml/bdb-ml-card-list/IAtributesCardList';

interface UseValidateView {
  affiliatedAccts: IAttributesCardList[];
  ownAccounts: IAttributesCardList[];
  firstLoad: boolean;
  getValidView: (component: string) => EmptyProperties;
  saveAccountSelected: (infoAditional: InfoAditional) => void;
  scheduledTransfersRedirect: () => void;
  enrollAccountRedirect: () => void;
}

export interface Avatar {
  text: string;
  color: string;
  size: string;
}

export interface InfoAditional {
  productNumber: string;
  productBankName: string;
  avatar: Avatar;
  icon: string;
  description: string;
  title: string;
  productType: ProductType;
  bankId: string;
}

interface EmptyProperties {
  clickButton?(): void;
  buttonIcon?: string;
  buttonText?: string;
  dataTestId?: string;
  descr?: string;
  descrLink?: string;
  img?: string;
}

interface EmptyMessage {
  message: string;
  buttonMessage: string;
  navigate?(): void;
}

interface ViewsProperties {
  condition?: boolean;
  component: string;
  emptyProperties?: EmptyProperties;
}

export const useValidateView = (): UseValidateView => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const accountsOwn = useSelector(savingsProductsWithoutAFCSelector);

  const accountsAffiliated = useSelector(getValidAffiliated);

  const accountOwnSelected = useSelector(getOwnAccountSelected);

  const accountAffiliatedSelect: AffiliatedAccount = useSelector(getAffiliatedAccountSelected);

  const validAccounts = useSelector(getValidAffiliatedAndProducts);

  const transferAccount = useSelector(getTransferAccount);

  const errorCatalog = useSelector(getErrorCatalog);

  const allProducts = useSelector(productsSelectorWithoutBalance);

  const errorAffiliated = useSelector(getErrorAffiliated);

  const errorProducts = useSelector(getErrorProducts);

  const productsQuantity = useSelector(productsCountSelector);

  const isConsumedBalanceService = useSelector(isConsumed);

  const [firstLoad, setFirstLoad] = useState(true);

  const [errorOnServiceProducts, setErrorOnServiceProducts] = useState(false);

  const [errorOnServiceAfiliated, setErrorOnServiceAfiliated] = useState(false);

  const [affiliatedAccts, setAffiliatedAccts] = useState([]);

  const [ownAccounts, setOwnAccounts] = useState([]);

  const { handleAfiliatedAccounts, handleOwnAccounts, organizeAlphabetically, organizeForTypeAccount } =
    useAccountsList();

  useEffect(() => {
    if (errorAffiliated) setErrorOnServiceAfiliated(true);
  }, [errorAffiliated]);

  useEffect(() => {
    if (errorProducts) setErrorOnServiceProducts(true);
  }, [errorProducts]);

  useEffect(() => {
    callServicesOfAccounts();
  }, []);

  useEffect(() => {
    if (productsQuantity > 0 && !firstLoad && !isConsumedBalanceService) {
      dispatch(balanceActions.setConsumed(true));
      callServiceBalances();
    }
  }, [productsQuantity, firstLoad]);

  useEffect(() => {
    if (accountsOwn) setOwnAccounts(addMenu(handleOwnAccounts(organizeForTypeAccount(accountsOwn)), true));

    if (accountsAffiliated) {
      setAffiliatedAccts(addMenu(organizeAlphabetically(handleAfiliatedAccounts(accountsAffiliated)), false));
      setErrorOnServiceAfiliated(false);
    }
  }, [accountsOwn.length, accountsAffiliated]);

  const addMenu = (accounts, areOwnAccounts: boolean) => {
    if (accountsOwn.length === 1 && areOwnAccounts) return accounts;
    return accounts.map(account => {
      return {
        ...account,
        menu: areOwnAccounts ? optionsOwnAccount : optionsAffiliatedAccounts
      };
    });
  };

  const callServiceProducts = (): void => {
    dispatch(fetchProducts({ disableLoader: false }));
  };

  const callServiceAccountsAffiliated = (): void => {
    dispatch(fetchAffiliatedAccountsList({ disableLoader: false, showModal: false }));
  };

  const callServicesOfAccounts = (): void => {
    dispatch(loadingActions.enable());
    setErrorOnServiceProducts(false);
    setErrorOnServiceAfiliated(false);
    setFirstLoad(true);
    Promise.all([
      dispatch(fetchProducts({ disableLoader: true })),
      dispatch(fetchAffiliatedAccountsList({ disableLoader: true, showModal: false }))
    ]).then(() => {
      setFirstLoad(false);
      dispatch(loadingActions.disable());
    });
  };

  const emptyMessage = (accounts: boolean, singleAccount: boolean): EmptyMessage => {
    if (accounts)
      return {
        buttonMessage: 'Abrir cuenta',
        message: 'Para realizar transacciones, abre tu cuenta sin costo y lista para usar de inmediato.'
      };
    if (singleAccount)
      return {
        buttonMessage: 'Inscribir cuenta',
        message: 'Inscribe cuentas de cualquier Banco y realiza transferencias sin salir de casa.',
        navigate: () => navigate(getNavigationPath(BetweenAccountPages.ENROLL_DESTINATION_ACCOUNT))
      };
    return {
      buttonMessage: 'Volver a cargar',
      message: 'Hubo un error al cargar tus cuentas.'
    };
  };

  const thereAreAccounts: boolean = accountsOwn?.length === 0 && accountsAffiliated?.length === 0;

  const isSingleAccount: boolean = accountsOwn.length === 1 && accountsAffiliated?.length === 0;

  const views: ViewsProperties[] = [
    {
      component: 'emptyState',
      condition: thereAreAccounts || isSingleAccount || (errorOnServiceAfiliated && errorOnServiceProducts),
      emptyProperties: {
        dataTestId: 'empty-state',
        descr: emptyMessage(thereAreAccounts, isSingleAccount).message,
        buttonText: emptyMessage(thereAreAccounts, isSingleAccount).buttonMessage,
        buttonIcon: 'ico-success',
        img: errorOnServiceAfiliated && errorOnServiceProducts ? serviceError : newAccount,
        //TODO: add actions create account
        clickButton: emptyMessage(thereAreAccounts, isSingleAccount).navigate ?? callServicesOfAccounts
      }
    },
    {
      component: 'retryOwnAccounts',
      condition: accountsOwn?.length === 0 && accountsAffiliated?.length > 0,
      emptyProperties: {
        dataTestId: 'retry-ownaccounts',
        clickButton: () => callServiceProducts()
      }
    },
    {
      component: 'retryAffiliatedAccounts',
      condition: accountsOwn?.length > 0 && !accountsAffiliated,
      emptyProperties: {
        dataTestId: 'retry-affiliated',
        clickButton: () => callServiceAccountsAffiliated()
      }
    }
  ];

  const getValidView = (component: string): EmptyProperties => {
    return views.find(item => item.condition && item.component === component)?.emptyProperties;
  };

  const saveAccountSelected = (infoAditional: InfoAditional): void => {
    const { avatar, productNumber, icon, description, productBankName, title, productType, bankId } = infoAditional;
    const accountTo = {
      avatar,
      icon,
      description,
      productBankName,
      title
    };
    if (!errorCatalog) dispatch(catalogsActions.reset());
    if (avatar) {
      dispatch(accountSelectActions.reset());
      dispatch(
        transferAccountActions.setTransferAccount({
          ...transferAccount,
          accountTo,
          accountFrom:
            accountsOwn.length === 1
              ? {
                  description: `${accountsOwn[0].productName} No. ${accountsOwn[0].productNumber}`,
                  productBankType: accountsOwn[0].productBankType,
                  productBankSubType: accountsOwn[0].productBankSubType,
                  productNumber: accountsOwn[0].productNumber
                }
              : transferAccount.accountFrom
        })
      );
      dispatch(
        affiliatedAccountsActions.setAccountAffiliatedSelected({
          productNumber,
          bankId,
          productType,
          productAlias: title
        })
      );
    } else {
      dispatch(affiliatedAccountsActions.resetAffiliatedSelected());
      dispatch(
        transferAccountActions.setTransferAccount({
          ...transferAccount,
          accountTo
        })
      );
      dispatch(
        accountSelectActions.setAccountOwnSelected(
          accountsOwn.find(ownAccount => ownAccount.productNumber === productNumber)
        )
      );
    }
  };

  const callServiceBalances = (): void => {
    makeRequestForBalanceApi(allProducts).forEach(balanceRequest => {
      dispatch(balanceDetail({ productsInfo: balanceRequest }));
    });
  };

  const scheduledTransfersRedirect = (): void => {
    const productNumber = isEmpty(accountAffiliatedSelect?.productNumber)
      ? accountOwnSelected.productNumber
      : accountAffiliatedSelect.productNumber;
    const acctSelected = validAccounts.find(acct => acct.productNumber === productNumber);
    Promise.resolve(dispatch(setTargetAccountByAccountSelected(acctSelected))).then(() => {
      navigate(getNavigationPathScheduled(ScheduledTranfersPages.SCHEDULED_CREATE, false));
    });
  };

  const enrollAccountRedirect = () => {
    if (!errorCatalog) dispatch(catalogsActions.reset());
    navigate(getNavigationPath(BetweenAccountPages.ENROLL_DESTINATION_ACCOUNT));
  };

  return {
    getValidView,
    ownAccounts,
    affiliatedAccts,
    firstLoad,
    saveAccountSelected,
    scheduledTransfersRedirect,
    enrollAccountRedirect
  };
};

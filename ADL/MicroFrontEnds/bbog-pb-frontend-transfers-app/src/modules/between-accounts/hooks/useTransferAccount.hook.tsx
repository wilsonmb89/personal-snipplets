import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../../store/products/products.entity';
import { savingsProductsWithoutAFCSelector } from '../../../store/products/products.select';
import { transferAccountActions } from '../store/transfer/account-transfer.reducer';
import { getTransferAccount, getTransferResponse } from '../store/transfer/account-transfer.select';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { BetweenAccountPages, getNavigationPath } from '../constants/navigation-paths';
import { getOwnAccountSelected } from '../store/selected/account-selected.select';
import { getAffiliatedAccountSelected } from '../../../store/affiliated-accounts/afilliated-accounts.select';
import { AffiliatedAccount } from '../../../store/affiliated-accounts/afilliated-accounts.entity';
import { BANK_INFO, BRANCH_ID, ACCOUNT_SUBTYPES } from '../../../constants/bank-codes';
import { TransferAccount, TransferRequest, TransferResponse } from '../store/transfer/account-transfer.entity';
import { IAttributesVoucher } from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/types/components/sherpa-ml/bdb-ml-bm-voucher/IAttributesVoucher';
import {
  IAttributeResumeHeader,
  IAttributeResumeDetail,
  IAttributeResumeAvatar
} from '@npm-bbta/bbog-dig-dt-webcomponents-lib/dist/types/components/sherpa-ml/bdb-ml-resume/IResume';
import { format } from 'date-fns';
import eoLocale from 'date-fns/locale/es';
import { accountSelectActions } from '../store/selected/account-selected.reducer';
import { AmountForm } from '../components/transfer-amount-form/TransferAmountForm';
import { Avatar } from './useValidateView.hook';
import { formatNumber } from '@utils/utils';
import { fetchDoTransfer } from '../store/transfer/account-transfer.effect';
import { AppDispatch } from '../../../store';
import { CATALOG_NAME } from '../../../constants/catalog-names';
import { fetchCatalog } from '../../../store/catalogs/catalogs.effect';
import { getDropdownNamedCatalog } from '../../../store/catalogs/catalogs.select';
import { isLoadingSelector } from '../../../store/loader/loader.store';
import { BdbAtDropdownModel } from '../../../components/sherpa/models/BdbAtDropdown.model';

export interface ItemData {
  cardName: string;
  cardDescription: string;
  value?: string;
  labelValue: string;
  secureValue: string;
  isChecked: string;
  seeDetails: boolean;
  productNumber: string;
  productBankType: string;
  productBankSubType: string;
}

interface VoucherState {
  status: string;
  statusCode: number;
  stamp: string;
  voucher: IAttributesVoucher;
}

export interface InfoAditional {
  productNumber: string;
  productBankName: string;
  avatar: Avatar;
  icon: string;
  description: string;
  title: string;
}

export interface ConditionalRequest {
  condition: boolean;
  transferRequest: TransferRequest;
}

interface UseTransferAccount {
  handleOwnAccounts: () => ItemData[];
  updateInfo: (value: AmountForm) => void;
  updatedAccountFrom: (detail: ItemData) => void;
  doTransfer: () => void;
  accountsForSelect: ItemData[];
  headerValues: IAttributeResumeHeader;
  avatarValues: IAttributeResumeAvatar;
  detailValues: IAttributeResumeDetail[];
  voucherData: VoucherState;
  transferAccount: TransferAccount;
  catalogError: Error;
  costTransaction: BdbAtDropdownModel;
}

export const useTransferAccount = (): UseTransferAccount => {
  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();

  const accountAffiliatedSelect: AffiliatedAccount = useSelector(getAffiliatedAccountSelected);

  const accountOwnSelected: Product = useSelector(getOwnAccountSelected);

  const ownAccounts = useSelector(savingsProductsWithoutAFCSelector);

  const loading = useSelector(isLoadingSelector);

  const isAffiliatedAccountSelected = isEmpty(accountOwnSelected.productNumber);

  const transferAccount: TransferAccount = useSelector(getTransferAccount);

  const transferResponse: TransferResponse = useSelector(getTransferResponse);

  const { items: costs, error: catalogError } = useSelector(getDropdownNamedCatalog(CATALOG_NAME.COST_TRANSACTIONS));

  const isAval = (account: AffiliatedAccount): boolean => {
    if (!account) return false;
    if (typeof account.aval === 'string' && account.aval === 'false') return false;
    if (typeof account.aval === 'boolean' && !account.aval) return false;
    return true;
  };

  const addCost = isAffiliatedAccountSelected && !isAval(accountAffiliatedSelect);

  useEffect(() => {
    if (addCost) dispatch(fetchCatalog({ catalogName: CATALOG_NAME.COST_TRANSACTIONS }, { useCache: true }));
  }, []);

  const costTransaction = costs.find(cost => cost.value === 'ACH_TRANSFER');

  const [voucherData, setVoucherData] = useState({
    status: '',
    statusCode: 0,
    stamp: '',
    voucher: null
  });

  const handleOwnAccounts = (): ItemData[] => {
    //TODO Here should go validation for amount in account and if that necesary disable select account
    const accountsCards = ownAccounts.map(
      ({ productNumber, balanceInfo, productBankType, productBankSubType, productName }) => {
        const balanceValue = parseFloat(balanceInfo?.balanceDetail ? balanceInfo.balanceDetail.Avail : '0');
        return {
          productNumber: productNumber,
          productBankType: productBankType,
          productBankSubType: productBankSubType,
          cardName: productName,
          cardDescription: `No. ${productNumber}`,
          labelValue: 'Disponible',
          secureValue: formatNumber(balanceValue, '$ ', 2, '.', ',', 3),
          isChecked: ownAccounts.length === 1 ? 'true' : 'false',
          seeDetails: false
        };
      }
    );
    if (isAffiliatedAccountSelected) {
      return accountsCards;
    } else {
      return accountsCards.filter(account => account.productNumber !== accountOwnSelected.productNumber);
    }
  };

  const [accountsForSelect, setAccountsForSelect] = useState(handleOwnAccounts());

  const updateInfo = value => {
    const { amount, note, numberOfBill } = value;
    dispatch(
      transferAccountActions.setTransferAccount({
        ...transferAccount,
        amount,
        note,
        numberOfBill,
        displayValue: isEmpty(amount) ? '-' : `$${amount},00`
      })
    );
  };

  const updatedAccountFrom = (detail: ItemData): void => {
    const { cardDescription, cardName, productNumber, productBankType, productBankSubType } = detail;
    if (accountsForSelect.length > 1) {
      setAccountsForSelect(
        accountsForSelect.map(account => {
          return {
            ...account,
            isChecked: account.productNumber === productNumber ? 'true' : 'false'
          };
        })
      );
    }
    dispatch(
      transferAccountActions.setTransferAccount({
        ...transferAccount,
        accountFrom: {
          description: `${cardName} ${cardDescription}`,
          productBankType,
          productBankSubType,
          productNumber: productNumber
        }
      })
    );
  };
  const transferBase = {
    // eslint-disable-next-line
    amount: parseFloat(transferAccount.amount.replace(/\./g, '').replace(/\,/g, '.')),
    paymentConcept: transferAccount.note,
    billId: transferAccount.numberOfBill
  };

  const transferRequests: ConditionalRequest[] = [
    {
      condition: isAffiliatedAccountSelected && ownAccounts.length === 1,
      transferRequest: {
        ...transferBase,
        accFromId: ownAccounts[0].productNumber,
        accFromType: ownAccounts[0].productBankType,
        accFromSubType: ownAccounts[0].productBankSubType,
        accToId: accountAffiliatedSelect?.productNumber,
        bankIdAcctTo: accountAffiliatedSelect?.bankId,
        accToType: accountAffiliatedSelect?.productType,
        accToSubType: null,
        branchId: BRANCH_ID
      }
    },
    {
      condition: isAffiliatedAccountSelected && ownAccounts.length > 1,
      transferRequest: {
        ...transferBase,
        accFromId: transferAccount.accountFrom.productNumber,
        accFromType: transferAccount.accountFrom.productBankType,
        accFromSubType: transferAccount.accountFrom.productBankSubType,
        accToId: accountAffiliatedSelect?.productNumber,
        bankIdAcctTo: accountAffiliatedSelect?.bankId,
        accToType: accountAffiliatedSelect?.productType,
        accToSubType: null,
        branchId: BRANCH_ID
      }
    },
    {
      condition: !isAffiliatedAccountSelected && ownAccounts.length > 1,
      transferRequest: {
        ...transferBase,
        accFromId: transferAccount.accountFrom.productNumber,
        accFromType: transferAccount.accountFrom.productBankType,
        accFromSubType: transferAccount.accountFrom.productBankSubType,
        accToId: accountOwnSelected.productNumber,
        bankIdAcctTo: BANK_INFO.BBOG.bankId,
        accToType: accountOwnSelected.productBankType,
        accToSubType: ACCOUNT_SUBTYPES[`${accountOwnSelected.productAthType}`],
        branchId: BRANCH_ID
      }
    }
  ];

  useEffect(() => {
    const voucherFilter = voucherStates.find(voucher => voucher.statusCode == transferResponse.status);
    if (voucherFilter) {
      setVoucherData({
        ...voucherFilter,
        voucher: {
          ...voucherFilter.voucher,
          date: format(new Date(), "d 'de' MMMM yyyy - h:mm:ss aaa", {
            locale: eoLocale
          }),
          voucherNumber: transferResponse.approvalId
        }
      });
      navigate(getNavigationPath(BetweenAccountPages.RESULT_OF_TRANSFER));
    }
  }, [transferResponse]);

  const doTransfer = async () => {
    dispatch(fetchDoTransfer(transferRequests.find(transfer => transfer.condition).transferRequest)).catch(() => {
      //TODO remove when implement modals for errors
      dispatch(transferAccountActions.reset());
      dispatch(accountSelectActions.reset());
      navigate(getNavigationPath(BetweenAccountPages.ACCOUNTS_LIST));
    });
  };

  const headerValues = {
    title: transferAccount.accountTo.title,
    desc: transferAccount.accountTo.productBankName,
    desc2: transferAccount.accountTo.description
  };

  const detailValues = [
    { title: 'Valor a transferir:', value: transferAccount.displayValue },
    {
      title: 'Costo:',
      value: addCost && !loading ? `$${costTransaction?.text}` : 'Gratis'
    }
  ];

  const avatarValues: IAttributeResumeAvatar = transferAccount.accountTo.icon
    ? { icon: transferAccount.accountTo.icon, text: '' }
    : transferAccount.accountTo.avatar;

  const voucherBase: IAttributesVoucher = {
    amount: transferAccount.amount.match(',') ? transferAccount.amount : `${transferAccount.amount},00`,
    labelTop: 'Destino',
    valueTop: transferAccount.accountTo.title,
    valueBottom: isAffiliatedAccountSelected && !accountAffiliatedSelect?.aval ? `$${costTransaction?.text}` : 'Gratis',
    labelBottom: 'Costo de la transacción:',
    description: ' '
  };

  const voucherStates: VoucherState[] = [
    {
      statusCode: 200,
      stamp: 'approved',
      status: 'SUCCESS',
      voucher: {
        ...voucherBase
      }
    }
  ];

  return {
    handleOwnAccounts,
    updateInfo,
    transferAccount,
    updatedAccountFrom,
    accountsForSelect,
    headerValues,
    avatarValues,
    doTransfer,
    detailValues,
    voucherData,
    catalogError,
    costTransaction
  };
};

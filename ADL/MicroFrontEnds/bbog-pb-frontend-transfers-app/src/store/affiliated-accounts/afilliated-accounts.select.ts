import { RootState } from '../index';

import { BANK_INFO } from '../../constants/bank-codes';
import { removeLeadingZeros } from '../../utils/text.utils';
import { Account, productsAdapter } from '../products/products.entity';
import { isAccount, isAFC, productsState, productToAccount } from '../products/products.select';
import { AffiliatedAccount, affiliatedAccountsAdapter, AffiliatedAccountsState } from './afilliated-accounts.entity';

const { selectAll } = affiliatedAccountsAdapter.getSelectors();
const { selectAll: selectAllProds } = productsAdapter.getSelectors();

export const affiliatedAccountsSelector = (state: RootState): AffiliatedAccountsState => state.affiliatedAccountsState;

export const getAffiliatedAccounts = (state: RootState): AffiliatedAccount[] => {
  const affiliatedAccountsState = affiliatedAccountsSelector(state);
  return affiliatedAccountsState.completed ? selectAll(affiliatedAccountsState.affiliatedAccounts) : null;
};

export const getErrorAffiliated = (state: RootState): Error => affiliatedAccountsSelector(state).error;

export const getCountOfAffiliatedAccounts = (state: RootState): number => {
  return getAffiliatedAccounts(state) ? getAffiliatedAccounts(state).length : null;
};

export const getValidAffiliated = (state: RootState): AffiliatedAccount[] => {
  const affiliatedAccountsState = affiliatedAccountsSelector(state);
  const affiliatedAccounts = affiliatedAccountsState.completed
    ? selectAll(affiliatedAccountsState.affiliatedAccounts)
    : null;
  return affiliatedAccounts;
};

export const getValidAffiliatedAndProducts = (state: RootState): AffiliatedAccount[] => {
  const affiliatedAccounts = getValidAffiliated(state);
  const products = selectAllProds(productsState(state).products).filter(isAccount).filter(isAFC).map(productToAccount);
  return mergeAccountData(orderByProductAlias(affiliatedAccounts), orderByProductType(products));
};

const orderByProductAlias = (affiliatedAccounts: AffiliatedAccount[]): AffiliatedAccount[] => {
  if (affiliatedAccounts) return affiliatedAccounts.sort((a, b) => a.productAlias.localeCompare(b.productAlias));
};

const orderByProductType = (accounts: Account[]): Account[] => {
  if (accounts) return accounts.sort(a => (a.acctType === 'SDA' ? -1 : 1));
};

const mergeAccountData = (accounts: AffiliatedAccount[], prodAccounts: Account[]): AffiliatedAccount[] => {
  if (accounts && prodAccounts && prodAccounts.length > 0) {
    const enrolledAccts = accounts.filter(
      acct => !prodAccounts.some(prod => removeLeadingZeros(prod.acctId) === removeLeadingZeros(acct.productNumber))
    );
    const ownedAccts = prodAccounts.map<AffiliatedAccount>(prod => ({
      productBank: BANK_INFO.BBOG.name,
      bankId: BANK_INFO.BBOG.bankId,
      aval: BANK_INFO.BBOG.aval,
      productAlias: prod.acctName,
      productName: prod.acctName,
      productType: prod.acctType,
      productNumber: prod.acctId,
      description: prod.acctName,
      priority: '',
      customer: {
        identificationNumber: '',
        identificationType: null,
        name: ''
      },
      contraction: ''
    }));
    return [...ownedAccts, ...enrolledAccts];
  } else {
    return [];
  }
};

export const getAffiliatedAccountSelected = (state: RootState): AffiliatedAccount =>
  state.affiliatedAccountsState.affiliatedAccountSelected;

import { RootState } from '..';
import { BdbAtDropdownModel } from '../../components/sherpa/models/BdbAtDropdown.model';
import { BANK_SUBTYPES, BANK_TYPES, ProductType } from '../../constants/bank-codes';
import { removeLeadingZeros } from '../../utils/text.utils';

import { Account, Product, productsAdapter, ProductsState } from './products.entity';

const { selectAll } = productsAdapter.getSelectors();

export const productToAccount = (product: Product): Account => ({
  acctId: product.productNumber,
  acctType: product.productBankType,
  acctName: product.productName
});

export const isAccount = (product: Product): boolean => {
  const accounts: ProductType[] = [BANK_TYPES.SAVINGS_ACCOUNT.code, BANK_TYPES.CHECK_ACCOUNT.code];
  return accounts.includes(product.productBankType);
};

export const isCreditCard = (product: Product): boolean => {
  const accounts: ProductType[] = [BANK_TYPES.CREDIT_CARD.code];
  return accounts.includes(product.productBankType);
};

export const isAFC = (product: Product): boolean => product.productBankSubType !== BANK_SUBTYPES.AFC.code;

export const isValid = (product: Product): boolean => product.valid;

export const isActive = (product: Product): boolean => product?.status === 'A';

export const productsState = (state: RootState): ProductsState => state.productsState;

export const productsSelector = (state: RootState): Product[] => selectAll(productsState(state).products);

export const hadBalance = (product: Product): boolean => !product.balanceInfo;

export const getErrorProducts = (state: RootState): Error => productsState(state).error;

export const productsCountSelector = (state: RootState): number => {
  const products = selectAll(productsState(state).products);
  return products.filter(isAccount).filter(isAFC).length;
};

export const getFirstProductSelector = (state: RootState): Product => {
  const product = selectAll(productsState(state).products)[0];
  return product;
};

export const savingsAccountsWithoutAFCSelector = (state: RootState): Account[] => {
  const products = selectAll(productsState(state).products);
  return products.filter(isAccount).filter(isAFC).map(productToAccount);
};

export const getCountOfAccountsWithoutAcfSelector = (state: RootState): number => {
  return savingsAccountsWithoutAFCSelector(state).length;
};

export const savingsAccountsSelectorDropdown = (state: RootState): BdbAtDropdownModel[] => {
  const targetAcctId = state.targetAccountState.accountId;
  return savingsAccountsWithoutAFCSelector(state)
    .filter(account => removeLeadingZeros(targetAcctId) !== removeLeadingZeros(account.acctId))
    .map(account => ({
      text: `${account.acctName} No. ${account.acctId}`,
      value: `${account.acctId}_${account.acctType}`
    }));
};

export const savingsProductsWithoutAFCSelector = (state: RootState): Product[] => {
  const products = selectAll(productsState(state).products);
  return products.filter(isAccount).filter(isAFC);
};

export const productsSelectorWithoutBalance = (state: RootState): Product[] => {
  return selectAll(productsState(state).products).filter(hadBalance);
};

export const creditCardsSelector = (state: RootState): Product[] => {
  const products = selectAll(productsState(state).products);
  return products.filter(isCreditCard).filter(isValid).filter(isActive);
};

export const creditCardsCountSelector = (state: RootState): number => {
  const products = selectAll(productsState(state).products);
  return products.filter(isCreditCard).filter(isValid).filter(isActive).length;
};

export const creditCardsOrderedSelector = (state: RootState): Product[] => {
  return creditCardsSelector(state).sort((prodA, prodB) => {
    if (
      prodA.franchise < prodB.franchise ||
      prodA.productName < prodB.productName ||
      prodA.description < prodB.description
    )
      return 1;

    if (
      prodA.franchise > prodB.franchise ||
      prodA.productName > prodB.productName ||
      prodA.description > prodB.description
    )
      return -1;

    return 0;
  });
};

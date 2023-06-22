import { RootState } from '..';
import { Account } from '../../limits/models/account.model';
import { Product, productsAdapter, ProductsState } from './products.entity';

const { selectAll } = productsAdapter.getSelectors();

const productToAccount = (product: Product): Account => ({
  acctId: product.productNumber,
  acctType: product.productBankType,
  acctName: product.productName
});

const isSavingAccount = (product: Product) => ['SDA', 'DDA'].includes(product.productBankType);

const isAFC = (product: Product) => product.productBankSubType !== '067AH';

export const productsState = (state: RootState): ProductsState => state.productsState;

export const productsSelector = (state: RootState): Product[] => selectAll(productsState(state).products);

export const savingsAccountsWithoutAFCSelector = (state: RootState): Account[] => {
  const products = selectAll(productsState(state).products);
  return products.filter(isSavingAccount).filter(isAFC).map(productToAccount);
};

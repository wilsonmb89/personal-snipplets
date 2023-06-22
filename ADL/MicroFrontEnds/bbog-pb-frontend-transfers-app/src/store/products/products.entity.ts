import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { ProductType } from '../../constants/bank-codes';
import { ProductBalanceInfo } from '../balances/balances.entity';
export interface Account {
  acctId: string;
  acctType: ProductType;
  acctName?: string;
}

export interface Product {
  productName: string;
  description: string;
  officeId: string;
  productAthType: string;
  productBankType: ProductType;
  productBankSubType: string;
  productNumber: string;
  valid: boolean;
  franchise: string;
  openDate: string;
  bin?: string;
  status?: string;
  balanceInfo?: ProductBalanceInfo;
}

export interface ProductsState {
  products: EntityState<Product>;
  error: Error | null;
}

export const productsAdapter = createEntityAdapter<Product>({
  selectId: (product: Product) => product.productNumber
});

export const initialState: ProductsState = {
  products: productsAdapter.getInitialState({
    ids: [],
    entities: {}
  }),
  error: null
};

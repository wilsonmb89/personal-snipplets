import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

export interface Account {
  acctId: string;
  acctType: string;
  acctName?: string;
}

export interface Product {
  productName: string;
  description: string;
  officeId: string;
  productAthType: string;
  productBankType: string;
  productBankSubType: string;
  productNumber: string;
  valid: boolean;
  franchise: string;
  openDate: string;
}

export interface ProductsState {
  products: EntityState<Product>;
}

export const productsAdapter = createEntityAdapter<Product>({
  selectId: (product: Product) => product.productNumber
});

export const initialState: ProductsState = {
  products: productsAdapter.getInitialState({
    ids: [],
    entities: {}
  })
};

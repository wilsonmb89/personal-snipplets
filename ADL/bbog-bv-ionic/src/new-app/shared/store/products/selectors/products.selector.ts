import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from '../states/products.state';

export const productsState = createFeatureSelector<ProductsState>('productsState');

export const productsSelector = createSelector(productsState, (state: ProductsState) => state.products);

export const getDigitalCdtSelector = (accountId: string) =>
  createSelector(productsState, (state: ProductsState) => state.digitalCdtBalances.find(item => item.accountId === accountId));

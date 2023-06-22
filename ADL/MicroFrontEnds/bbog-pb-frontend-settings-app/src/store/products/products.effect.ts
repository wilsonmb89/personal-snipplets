import { Dispatch } from '@reduxjs/toolkit';
import { fetchProductsApi } from './products.api';
import { loadingHandler } from '../loader/loader.store';
import { productsActions } from './products.reducer';
import { RootState } from '..';
import { isEqual } from 'lodash';
import { initialState } from './products.entity';

export const fetchProducts = (force = false): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    if (!isEqual(state.productsState.products, initialState.products) && !force) {
      return;
    }
    try {
      const products = await fetchProductsApi();
      dispatch(productsActions.fetchProductsSuccess(products));
    } catch (error) {
      console.log(error);
    }
  };
  return loadingHandler.bind(null, fetch);
};

import { Dispatch } from '@reduxjs/toolkit';
import { fetchCatalogsApi } from './catalogs.api';
import { loadingHandler } from '../loader/loader.store';
import { CatalogType, initialState } from './catalogs.entity';
import { catalogsActions } from './catalogs.reducer';
import { isEqual } from 'lodash';
import { RootState } from '..';
import { showError } from '../error/error.store';

export const fetchCatalog = (
  catalogName: CatalogType,
  options?: { force?: boolean; disableLoader?: boolean }
): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    if (!isEqual(state.catalogsState.catalogs, initialState.catalogs) && !options?.force) {
      return;
    }
    try {
      const catalogs = await fetchCatalogsApi({ catalogName });
      dispatch(catalogsActions.fetchCatalogsSuccess(catalogs));
    } catch (error) {
      dispatch(
        showError({
          name: 'Error al cargar los Topes',
          message: 'En estos momentos no pudimos cargar los Topes de tu cuenta. Por favor intenta nuevamente.'
        })
      );
      throw error;
    }
  };
  return options?.disableLoader ? fetch : loadingHandler.bind(null, fetch);
};

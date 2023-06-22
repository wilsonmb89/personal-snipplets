import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '..';
import { loadingHandler } from '../loader/loader.store';
import { fetchCatalogApi } from './catalogs.api';
import { CatalogEntity, GetCatalogRq } from './catalogs.entity';
import { catalogsActions } from './catalogs.reducer';

export const fetchCatalog = (getCatalogRq: GetCatalogRq, useCache = false): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const state = getState();
    const currCatalogs: CatalogEntity[] = state.catalogsState.catalogEntities || [];
    if (useCache && currCatalogs && currCatalogs.length > 0) {
      const currCatalog = currCatalogs.find(catalog => catalog.catalogName === getCatalogRq.catalogName);
      if (currCatalog) {
        return;
      }
    }
    try {
      const newCatalog = await fetchCatalogApi(getCatalogRq);
      const newCatalogState: CatalogEntity = {
        catalogName: getCatalogRq.catalogName,
        catalogItems: newCatalog
      };
      dispatch(catalogsActions.fetchCatalogSuccess(newCatalogState));
    } catch (error) {
      console.error(error);
    }
  };
  return loadingHandler.bind(null, fetch);
};

import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

export interface GetCatalogRq {
  catalogName: string;
  parentId?: string;
}

export enum CatalogType {
  LIMITS_BOUNDS = 'LIMITS_BOUNDS'
}

export interface CatalogData {
  id: string;
  name: string;
  parentId?: string;
  catalogName?: string;
}

export interface CatalogsState {
  catalogs: EntityState<CatalogData>;
}

export const catalogsAdapter = createEntityAdapter<CatalogData>({
  selectId: (catalog: CatalogData) => catalog.id
});

export const initialState: CatalogsState = {
  catalogs: catalogsAdapter.getInitialState({
    ids: [],
    entities: {}
  })
};

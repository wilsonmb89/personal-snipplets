import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

export interface GetCatalogRq {
  catalogName: string;
  parentId?: string;
}

export interface CatalogData {
  id: string;
  name: string;
  parentId: string;
}

export interface CatalogEntity {
  catalogName: string;
  catalogItems: CatalogData[];
}

export interface CatalogState {
  catalogEntities: EntityState<CatalogEntity>;
}

export const catalogsAdapter = createEntityAdapter<CatalogEntity>({
  selectId: (catalogEntity: CatalogEntity) => catalogEntity.catalogName
});

export const initialState: CatalogState = {
  catalogEntities: catalogsAdapter.getInitialState({
    ids: [],
    entities: {}
  })
};

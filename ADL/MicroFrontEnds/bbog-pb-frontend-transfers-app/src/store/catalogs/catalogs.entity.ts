import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

export interface GetCatalogRq {
  catalogName: string;
  parentId?: string;
}

export interface CustomFileds {
  isActiveMB: boolean;
  isAval: boolean;
  type: string;
  isActive: boolean;
  enableEnrollTC?: boolean;
}

export interface CatalogData {
  id: string;
  name: string;
  parentId: string;
  customFields?: CustomFileds;
}

export interface CatalogEntity {
  catalogName: string;
  catalogItems: CatalogData[];
}

export interface CatalogState {
  catalogEntities: EntityState<CatalogEntity>;
  error: Error | null;
}

export const catalogsAdapter = createEntityAdapter<CatalogEntity>({
  selectId: (catalogEntity: CatalogEntity) => catalogEntity.catalogName
});

export const initialState: CatalogState = {
  catalogEntities: catalogsAdapter.getInitialState({
    ids: [],
    entities: {}
  }),
  error: null
};

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CatalogEntity, catalogsAdapter, initialState } from './catalogs.entity';

export const catalogsState = createSlice({
  name: 'CatalogsState',
  initialState,
  reducers: {
    fetchCatalogSuccess(state, { payload }: PayloadAction<CatalogEntity>) {
      catalogsAdapter.upsertOne(state.catalogEntities, payload);
    },
    reset(state) {
      state.catalogEntities = initialState.catalogEntities;
    }
  }
});

export const catalogsActions = catalogsState.actions;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CatalogEntity, catalogsAdapter, initialState } from './catalogs.entity';

export const catalogsState = createSlice({
  name: 'CatalogsState',
  initialState,
  reducers: {
    fetchCatalogSuccess(state, { payload }: PayloadAction<CatalogEntity>) {
      catalogsAdapter.upsertOne(state.catalogEntities, payload);
      state.error = null;
    },
    setError(state, { payload }: PayloadAction<Error>) {
      state.catalogEntities = initialState.catalogEntities;
      state.error = payload;
    },
    reset(state) {
      state.catalogEntities = initialState.catalogEntities;
      state.error = null;
    }
  }
});

export const catalogsActions = catalogsState.actions;

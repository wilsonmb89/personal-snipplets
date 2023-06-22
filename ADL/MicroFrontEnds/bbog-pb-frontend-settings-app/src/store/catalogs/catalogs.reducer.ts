import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sessionStorageReducer } from '../session-storage.reducer';
import { initialState, catalogsAdapter, CatalogData } from './catalogs.entity';

export const createCatalogsState = createSlice({
  name: 'CatalogsState',
  initialState,
  reducers: {
    fetchCatalogsSuccess(state, { payload }: PayloadAction<CatalogData[]>) {
      catalogsAdapter.setAll(state.catalogs, payload);
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'CatalogsState', ['fetchCatalogsSuccess']);
  }
});

export const catalogsActions = createCatalogsState.actions;

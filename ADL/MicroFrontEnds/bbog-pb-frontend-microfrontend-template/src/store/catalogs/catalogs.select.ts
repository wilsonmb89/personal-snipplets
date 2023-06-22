import { RootState } from '..';
import { CatalogData, CatalogEntity, catalogsAdapter, CatalogState } from './catalogs.entity';

const { selectAll } = catalogsAdapter.getSelectors();

export const catalogsState = (state: RootState): CatalogState => state.catalogsState;

export const allCatalogsSelector = (state: RootState): CatalogEntity[] => {
  return selectAll(catalogsState(state).catalogEntities);
};

export const getNamedCatalog = (catalogName: string) => (state: RootState): CatalogData[] => {
  const allCatalogs = allCatalogsSelector(state);
  if (allCatalogs && allCatalogs.length > 0) {
    const namedCatalog = allCatalogs.find(catalog => catalog.catalogName === catalogName);
    return namedCatalog.catalogItems || [];
  }
  return [];
};

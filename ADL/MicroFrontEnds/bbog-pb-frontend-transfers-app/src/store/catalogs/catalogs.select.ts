import { RootState } from '..';
import { BdbAtDropdownModel } from '../../components/sherpa/models/BdbAtDropdown.model';
import { CatalogData, CatalogEntity, catalogsAdapter, CatalogState } from './catalogs.entity';

const { selectAll } = catalogsAdapter.getSelectors();

export const catalogsState = (state: RootState): CatalogState => state.catalogsState;

export const allCatalogsSelector = (state: RootState): CatalogEntity[] => {
  return selectAll(catalogsState(state).catalogEntities);
};

export const getErrorCatalog = (state: RootState): Error => {
  return catalogsState(state).error;
};

export const getNamedCatalog =
  (catalogName: string) =>
  (state: RootState): CatalogData[] => {
    const allCatalogs = allCatalogsSelector(state);
    if (allCatalogs && allCatalogs.length > 0) {
      const namedCatalog = allCatalogs.find(catalog => catalog.catalogName === catalogName);
      return namedCatalog ? namedCatalog.catalogItems : [];
    }
    return [];
  };

export const getDropdownNamedCatalog =
  (catalogName: string) =>
  (state: RootState): { items: BdbAtDropdownModel[]; error: Error } => {
    const allCatalogs = getNamedCatalog(catalogName);
    return {
      items: allCatalogs(state).map(catalog => {
        return { text: catalog.name, value: catalog.id };
      }),
      error: state.catalogsState.error
    };
  };

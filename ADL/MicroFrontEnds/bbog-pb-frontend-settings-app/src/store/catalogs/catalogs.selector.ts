import { RootState } from '..';
import { CatalogData, catalogsAdapter, CatalogsState } from './catalogs.entity';

const { selectAll } = catalogsAdapter.getSelectors();

export const catalogsState = (state: RootState): CatalogsState => state.catalogsState;

export const limitsBoundsSelector = (state: RootState): CatalogData[] => {
  const catalogs = selectAll(catalogsState(state).catalogs);
  return catalogs;
};

export const accountTopLimitSelector = (state: RootState): number => {
  const accountTopLimit = limitsBoundsSelector(state).find(catalog => catalog.id === 'ACCOUNT_TOP_LIMIT');
  return accountTopLimit ? +accountTopLimit.name : 0;
};

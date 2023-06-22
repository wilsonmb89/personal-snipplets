import { Catalogue, CreditTypes } from '../../../../core/services-apis/user-features/models/catalogue.model';
import { CatalogsEnum } from '../../../../core/services-delegate/list-parameters/enums/catalogs-enum';
import { createSelector } from '@ngrx/store';
import { UserState } from '../states/user.state';
import { userState } from './user.selector';

export type CostTypes = 'CASH_ADVANCE' | 'ACH_TRANSFER';

export const catalogueByTypeSelector = (catalogueType: CatalogsEnum) =>
  createSelector(userState, (state: UserState) => {
    return state.catalogs[catalogueType];
  });

export const transactionCostCatalogueSelector = createSelector(
  catalogueByTypeSelector(CatalogsEnum.VALOR_TRANSACCIONES),
  (transactionCostCatalogue: Catalogue[]) => transactionCostCatalogue
);

export const transactionCostByTypeSelector = (costType: CostTypes) =>
  createSelector(transactionCostCatalogueSelector, (transactionCostCatalogue: Catalogue[] = []) => {
    const catalogueItem = transactionCostCatalogue.find(item => item.id === costType);
    return catalogueItem ? catalogueItem.name : null;
  });

export const creditTypesCatalogueSelector = createSelector(
  catalogueByTypeSelector(CatalogsEnum.CREDITOS_AVAL),
  (creditTypesCatalogue: Catalogue[]) => {
    return creditTypesCatalogue;
  }
);

export const creditTypesMapperSelector = createSelector(creditTypesCatalogueSelector, (creditTypesCatalogue: Catalogue[] = []) => {
  return creditTypesCatalogue.map(c => {
    return {
      id: c.id,
      types: JSON.parse(c.name)
    };
  });
});

export const creditTypesByBankSelector = (idBank: string) =>
  createSelector(creditTypesMapperSelector, (creditTypes: CreditTypes[] = []) => {
    return creditTypes.find(c => idBank.endsWith(c.id)).types;
  });


export const bankListCatalogueSelector = createSelector(
  catalogueByTypeSelector(CatalogsEnum.BANK_LIST),
  (bankListCatalogue: Catalogue[]) => {
    return bankListCatalogue;
  }
);

export const listBankTransfersSelector = () =>
  createSelector(bankListCatalogueSelector, (listBanks: Catalogue[] = []) => {
    return listBanks.filter(b => b.customFields.isActive === 'true');
  });

export const listBankCreditsSelector = () =>
  createSelector(bankListCatalogueSelector, (listBanks: Catalogue[] = []) => {
    return listBanks.filter(b => b.customFields.isActive === 'true' && b.customFields.isAval === 'true');
  });

export const listBankCreditCardSelector = () =>
  createSelector(bankListCatalogueSelector, (listBanks: Catalogue[] = []) => {
    return listBanks.filter(b => b.customFields.isActive === 'true' && b.customFields.type === 'bank');
  });

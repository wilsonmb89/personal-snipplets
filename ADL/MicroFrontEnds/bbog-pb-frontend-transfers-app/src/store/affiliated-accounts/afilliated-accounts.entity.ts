import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { ProductType } from '../../constants/bank-codes';
import { DocumentType } from '../../constants/document';

export interface AffiliatedAccount {
  productBank?: string;
  bankId: string;
  aval?: boolean | 'true' | 'false';
  productAlias: string;
  productName?: string;
  productType: ProductType;
  productNumber: string;
  description?: string;
  priority?: string;
  customer?: Customer;
  contraction?: string;
}

export interface Customer {
  identificationType: DocumentType;
  identificationNumber: string;
  name?: string;
}

export interface AffiliatedAccountsState {
  affiliatedAccounts: EntityState<AffiliatedAccount>;
  affiliatedAccountSelected: AffiliatedAccount;
  error: Error | null;
  completed: boolean;
}

export const affiliatedAccountsAdapter = createEntityAdapter<AffiliatedAccount>({
  selectId: (affiliatedAccounts: AffiliatedAccount) => {
    const { productNumber, productType, bankId } = affiliatedAccounts;
    return `${productNumber}-${productType}-${bankId}`;
  }
});

export const initialState: AffiliatedAccountsState = {
  affiliatedAccounts: affiliatedAccountsAdapter.getInitialState({
    ids: [],
    entities: {}
  }),
  affiliatedAccountSelected: null,
  error: null,
  completed: false
};

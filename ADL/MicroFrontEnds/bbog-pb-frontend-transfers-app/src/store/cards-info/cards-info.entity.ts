import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';

export interface GetCardsRq {
  acctId: string;
  acctType: string;
  requireAllCards: string;
  cardStatus: string[];
}

export interface GetCardsRs {
  accountList: AccountList[];
}

export interface AccountList {
  description: string;
  bankId: string;
  productBankType: string;
  productNumber: string;
  status: string;
  lockId?: string;
}

export interface CustomerCard {
  cardNumber: string;
  cardType: string;
  expDate: string;
  cardState: string;
  displayNumber: string;
  lastDigits: string;
  cardVerifyData?: string;
  nameCard?: string;
  description?: string;
  logoPath?: string;
  lockId?: string;
}

export interface CardsInfoState {
  customerCardList: EntityState<CustomerCard>;
  completed: boolean;
  error?: Error | null;
}

export const customerCardListAdapter = createEntityAdapter<CustomerCard>({
  selectId: (customerCard: CustomerCard) => customerCard.cardNumber
});

export const initialState: CardsInfoState = {
  customerCardList: customerCardListAdapter.getInitialState({
    ids: [],
    entities: {}
  }),
  completed: false,
  error: null
};

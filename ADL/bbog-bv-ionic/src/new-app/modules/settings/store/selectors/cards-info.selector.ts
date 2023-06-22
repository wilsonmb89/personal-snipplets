import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CardsInfoState } from '../states/cards-info.state';

export const getCardsInfoState = createFeatureSelector<CardsInfoState>('cardsInfoState');

export const getCustomerCardsListWorking = createSelector(
  getCardsInfoState,
  (state: CardsInfoState) => state.working
);

export const getCustomerCardsListCompleted = createSelector(
  getCardsInfoState,
  (state: CardsInfoState) => state.completed
);

export const getCustomerCardsListError = createSelector(
  getCardsInfoState,
  (state: CardsInfoState) => state.error
);

export const getAllCustomerCardsList = createSelector(
  getCardsInfoState,
  (state: CardsInfoState) => state.customerCardList
);

export const getCustomerCardsListDebitN = createSelector(
  getCardsInfoState,
  (state: CardsInfoState) =>
    !!state && !!state.customerCardList && state.customerCardList.length > 0 ?
    state.customerCardList.filter(e => e.cardType === 'DEB' && e.cardState === 'N') :
    []
);

export const getCustomerCardSecurePass = createSelector(
  getCardsInfoState,
  (state: CardsInfoState) =>
    !!state && !!state.customerCardList && state.customerCardList.length > 0 ?
    state.customerCardList.filter(e => e.cardType === 'PRIV' && e.cardState === 'N').length > 0 :
    false
);

export const getCustomerPendingDebitCards = createSelector(
  getCardsInfoState,
  (state: CardsInfoState) =>
  !!state && !!state.customerCardList && state.customerCardList.length > 0 ?
  state.customerCardList.filter(e => e.cardType === 'DEB' && e.cardState === 'E') :
  []
);

export const getCustomerPendingCreditCards = createSelector(
  getCardsInfoState,
  (state: CardsInfoState) =>
  !!state && !!state.customerCardList && state.customerCardList.length > 0 ?
  state.customerCardList.filter(e => e.cardType === 'CRE' && e.cardState === '4') :
  []
);

export const getCustomerActiveDebitCards = createSelector(
  getCardsInfoState,
  (state: CardsInfoState) =>
  !!state && !!state.customerCardList && state.customerCardList.length > 0 ?
  state.customerCardList.filter(e => e.cardType === 'DEB' && e.cardState !== 'E') :
  []
);

export const getCustomerActiveCreditCards = createSelector(
  getCardsInfoState,
  (state: CardsInfoState) =>
  !!state && !!state.customerCardList && state.customerCardList.length > 0 ?
  state.customerCardList.filter(e => e.cardType === 'CRE' && e.cardState !== '4') :
  []
);

export const getCustomerCreditCardsN = createSelector(
  getCardsInfoState,
  (state: CardsInfoState) =>
  !!state && !!state.customerCardList && state.customerCardList.length > 0 ?
  state.customerCardList.filter(e => e.cardType === 'CRE' && e.cardState !== 'N') :
  []
);

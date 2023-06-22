import { Dispatch } from 'redux';
import { isEqual } from 'lodash';

import { RootState } from '..';
import { loadingHandler } from '../loader/loader.store';
import { AccountList, CustomerCard, GetCardsRq, initialState } from './cards-info.entity';
import { fetchCardsInfoApi } from './cards-info.api';
import { cardsInfoActions } from './cards-info.reducer';

const CONST_CUSTOMER_CARD_EXP_DATE = '2050-01-01T19:38:41.000+0000';

export const fetchCardsInfo = (options?: { force?: boolean; disableLoader?: boolean }): (() => Promise<void>) => {
  const fetch = async (dispatch: Dispatch, getState: () => RootState): Promise<void> => {
    const { cardsInfoState } = getState();
    if (!isEqual(cardsInfoState.customerCardList, initialState.customerCardList) && !options?.force) {
      return;
    }
    dispatch(cardsInfoActions.reset());
    try {
      const request = buildFetchCardsInfoRq();
      const customerCardData = await fetchCardsInfoApi(request);
      dispatch(cardsInfoActions.fetchCardsInfoSuccess(customerCardData.accountList.map(mapAccountListResponse)));
    } catch (error) {
      dispatch(cardsInfoActions.fetchCardsInfoError(error));
    }
  };
  return loadingHandler.bind(null, fetch);
};

const mapAccountListResponse = (account: AccountList): CustomerCard => {
  return {
    cardState: account.status,
    cardNumber: account.productNumber,
    lastDigits: getLastDigitsNumberCard(account.productNumber),
    displayNumber: getLastDisplayNumberCard(account.productNumber),
    expDate: CONST_CUSTOMER_CARD_EXP_DATE,
    cardType: account.productBankType,
    description: account.description,
    lockId: account.lockId
  };
};

const getLastDigitsNumberCard = (cardNumber: string): string => {
  const lastDigitsLength = 8;
  if (cardNumber.length > lastDigitsLength) {
    return cardNumber.substring(cardNumber.length - lastDigitsLength);
  }
  return cardNumber;
};

const getLastDisplayNumberCard = (cardNumber: string): string => {
  const lastDigitsLength = 4;
  const lastDigits = getLastDigitsNumberCard(cardNumber);
  if (lastDigits.length > lastDigitsLength) {
    return `****${lastDigits.substring(lastDigits.length - lastDigitsLength)}`;
  }
  return lastDigits;
};

const buildFetchCardsInfoRq = (): GetCardsRq => {
  return {
    acctId: '',
    acctType: '',
    cardStatus: ['ALL'],
    requireAllCards: '1'
  };
};

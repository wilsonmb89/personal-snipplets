import { RootState } from '..';

import { CardsInfoState, CustomerCard, customerCardListAdapter } from './cards-info.entity';

const { selectAll } = customerCardListAdapter.getSelectors();

export const cardsInfoSelector = (state: RootState): CardsInfoState => state.cardsInfoState;

export const customerCardListSelector = (state: RootState): CustomerCard[] => {
  const cardsInfoState = cardsInfoSelector(state);
  return cardsInfoState.completed ? selectAll(cardsInfoState.customerCardList) : null;
};

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sessionStorageReducer } from '../session-storage.reducer';

import { CustomerCard, customerCardListAdapter, initialState } from './cards-info.entity';

export const cardsInfoState = createSlice({
  name: 'CardsInfoState',
  initialState,
  reducers: {
    fetchCardsInfoSuccess(state, { payload }: PayloadAction<CustomerCard[]>) {
      customerCardListAdapter.setAll(state.customerCardList, payload);
      state.completed = true;
      state.error = null;
    },
    fetchCardsInfoError(state, { payload }: PayloadAction<Error>) {
      customerCardListAdapter.removeAll(state.customerCardList);
      state.completed = true;
      state.error = payload;
    },
    reset() {
      return {
        ...initialState
      };
    }
  },
  extraReducers: builder => {
    sessionStorageReducer(builder, 'CardsInfoState', ['fetchCardsInfoSuccess', 'fetchCardsInfoError', 'reset']);
  }
});

export const cardsInfoActions = cardsInfoState.actions;

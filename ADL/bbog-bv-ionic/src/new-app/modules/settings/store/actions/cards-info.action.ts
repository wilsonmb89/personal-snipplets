import { Action } from '@ngrx/store';

import { CustomerCard } from '../../../../../app/models/activation-cards/customer-cards-list-rs';

export const FETCH_CARDS_INFO = '[Global/API] Fetch get cards and info';
export const REFRESH_CARDS_INFO = '[Global/API] Refresh get cards and info';
export const FETCH_CARDS_INFO_SUCCESS = '[Global/API] Fetch get cards and info success';
export const FETCH_CARDS_INFO_ERROR = '[Global/API] Fetch get cards and info error';
export const REMOVE_CARDS_INFO = '[Global/API] Remove get cards and info';

export class FetchCardsInfoAction implements Action {
  readonly type = FETCH_CARDS_INFO;
}

export class RefreshCardsInfoAction implements Action {
  readonly type = REFRESH_CARDS_INFO;
}

export class FetchCardsInfoActionSuccess implements Action {
  readonly type = FETCH_CARDS_INFO_SUCCESS;

  constructor(
    public customerCardList: CustomerCard[]
  ) {}
}

export class FetchCardsInfoActionError implements Action {
  readonly type = FETCH_CARDS_INFO_ERROR;

  constructor(public error: any) { }
}

export class RemoveCardsInfoAction implements Action {
  readonly type = REMOVE_CARDS_INFO;
}

export type CardsInfoActions =
  FetchCardsInfoAction |
  RefreshCardsInfoAction |
  FetchCardsInfoActionSuccess |
  FetchCardsInfoActionError |
  RemoveCardsInfoAction;

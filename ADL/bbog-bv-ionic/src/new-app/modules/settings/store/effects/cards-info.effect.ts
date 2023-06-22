import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { withLatestFrom, map, catchError } from 'rxjs/operators';

import { CardsInfoDelegateService } from '@app/delegate/products-delegate/cards-info-delegate.service';
import { CardsInfoState } from '../states/cards-info.state';
import * as cardsInfoActions from '../actions/cards-info.action';
import * as cardsInfoSelector from '../selectors/cards-info.selector';

@Injectable()
export class CardsInfoEffect {

  constructor(
    private actions$: Actions,
    private store: Store<CardsInfoState>,
    private cardsInfoDelegateService: CardsInfoDelegateService
  ) {}

  @Effect()
  fetchCardsInfo$: Observable<Action> = this.actions$
    .ofType(cardsInfoActions.FETCH_CARDS_INFO)
    .concatMap(action => of(action).pipe(
      withLatestFrom(
        this.store.select(cardsInfoSelector.getAllCustomerCardsList),
        this.store.select(cardsInfoSelector.getCustomerCardsListCompleted)
      )
    ))
    .mergeMap(([state, customerCardListStore, complete]) => {
      if (complete) {
        return of(({
          type: cardsInfoActions.FETCH_CARDS_INFO_SUCCESS,
          customerCardList: customerCardListStore
        }));
      }
      return this.cardsInfoDelegateService.getCardsMappedCustomerCard().pipe(
        map(
          res => ({
            type: cardsInfoActions.FETCH_CARDS_INFO_SUCCESS,
            customerCardList: res
          })
        ),
        catchError((err: any) => of({
          type: cardsInfoActions.FETCH_CARDS_INFO_ERROR,
          error: err
        }))
      );
    });

  @Effect()
  refreshCardsInfo$: Observable<Action> = this.actions$
    .ofType(cardsInfoActions.REFRESH_CARDS_INFO)
    .mergeMap((action) => of(
      ({
        type: cardsInfoActions.FETCH_CARDS_INFO,
      })
    ));
}

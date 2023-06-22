import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { CustomerCard } from '../../../../../app/models/activation-cards/customer-cards-list-rs';
import { CardsInfoState } from '../states/cards-info.state';
import * as cardsInfoListSelector from '../selectors/cards-info.selector';
import * as cardsInfoActions from '../actions/cards-info.action';


@Injectable()
export class CardsInfoFacade {

  cardsInfoState$: Observable<CardsInfoState> = this.store.select(cardsInfoListSelector.getCardsInfoState);
  cardsInfo$: Observable<CustomerCard[]> = this.store.select(cardsInfoListSelector.getAllCustomerCardsList);
  cardsInfoDebitN$: Observable<CustomerCard[]> = this.store.select(cardsInfoListSelector.getCustomerCardsListDebitN);
  hasSecurePass$: Observable<boolean> = this.store.select(cardsInfoListSelector.getCustomerCardSecurePass);
  cardsInfoWorking$: Observable<boolean> = this.store.select(cardsInfoListSelector.getCustomerCardsListWorking);
  cardsInfoCompleted$: Observable<boolean> = this.store.select(cardsInfoListSelector.getCustomerCardsListCompleted);
  cardsInfoError$: Observable<any> = this.store.select(cardsInfoListSelector.getCustomerCardsListError);
  cardsPendingDebit$: Observable<CustomerCard[]> = this.store.select(cardsInfoListSelector.getCustomerPendingDebitCards);
  cardsPendingCredit$: Observable<CustomerCard[]> = this.store.select(cardsInfoListSelector.getCustomerPendingCreditCards);
  cardsActiveDebit$: Observable<CustomerCard[]> = this.store.select(cardsInfoListSelector.getCustomerActiveDebitCards);
  cardsActiveCredit$: Observable<CustomerCard[]> = this.store.select(cardsInfoListSelector.getCustomerActiveCreditCards);
  cardsInfoCreditN$: Observable<CustomerCard[]> = this.store.select(cardsInfoListSelector.getCustomerCreditCardsN);

  constructor(private store: Store<CardsInfoState>) { }

  public fetchCardsInfo(): void {
    this.store.dispatch(new cardsInfoActions.FetchCardsInfoAction());
  }

  public refreshCardsInfo(): void {
    this.store.dispatch(new cardsInfoActions.RefreshCardsInfoAction());
  }

  public removeCardsInfo(): void {
    this.store.dispatch(new cardsInfoActions.RemoveCardsInfoAction());
  }

}

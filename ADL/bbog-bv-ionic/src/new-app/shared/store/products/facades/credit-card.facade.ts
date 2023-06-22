import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CreditCardAccountInfoRq } from '@app/apis/customer-security/models/creditCardAccountInfo';
import { CreditCardActivationRq } from '@app/apis/customer-security/models/creditCardActivation';
import { CreditCardBlockRq } from '@app/apis/customer-security/models/creditCardBlock';
import { CreditCardUnblockRq } from '@app/apis/customer-security/models/creditCardUnblock';
import { CreditCardState } from '../states/credit-card.state';
import * as creditCardActions from '../actions/credit-card.action';
import * as creditCardSelector from '../selectors/credit-card.selector';

@Injectable()
export class CreditCardFacade {
  creditCardActivationState$: Observable<CreditCardState> = this.store.select(creditCardSelector.creditCardState);

  constructor(private store: Store<CreditCardState>) {}

  public creditCardAccountInfo(creditCardAccountInfoRq: CreditCardAccountInfoRq): void {
    this.store.dispatch(new creditCardActions.CardAccountInfoAction(creditCardAccountInfoRq));
  }

  public creditCardActivation(creditCardActivationRq: CreditCardActivationRq): void {
    this.store.dispatch(new creditCardActions.CardActivationAction(creditCardActivationRq));
  }

  public creditCardBlock(creditCardBlockRq: CreditCardBlockRq): void {
    this.store.dispatch(new creditCardActions.CardBlockAction(creditCardBlockRq));
  }

  public creditCardUnblock(creditCardUnblockRq: CreditCardUnblockRq): void {
    this.store.dispatch(new creditCardActions.CardUnblockAction(creditCardUnblockRq));
  }

  public creditCardsToActivateHidden(): void {
    this.store.dispatch(new creditCardActions.CardsToActivateHiddenAction());
  }

  public creditCardsToActivateShow(): void {
    this.store.dispatch(new creditCardActions.CardsToActivateShowAction());
  }

  public creditCardActivationReset(): void {
    this.store.dispatch(new creditCardActions.CreditCardResetAction());
  }

  public rememberKeyTooltipShow(): void {
    this.store.dispatch(new creditCardActions.RemeberKeyTooltipShowAction());
  }

  public rememberKeyTooltipHidden(): void {
    this.store.dispatch(new creditCardActions.RemeberKeyTooltipHiddenAction());
  }

}

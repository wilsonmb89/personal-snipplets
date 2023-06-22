import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AcObligationsState } from '../states/ac-obligations.state';
import { Observable } from 'rxjs/Observable';
import * as fromACObligationsSelector from '../selectors/ac-obligations.selector';
import * as fromACObligationsActions from '../actions/ac-obligations.action';
import { PaymentObligation } from '../../../../core/services-apis/transfer/transfer-core/models/payment-obligations.model';
import { CardACObligation } from '../selectors/ac-obligations.selector';

@Injectable()
export class AcObligationsFacade {

  acObligations$: Observable<PaymentObligation[]> = this.store.select(fromACObligationsSelector.getAvalCreditsObligation);
  acObligationsWorking$: Observable<boolean> = this.store.select(fromACObligationsSelector.getAvalCreditsObligationWorking);
  avalObligationsCompleted$: Observable<boolean> = this.store.select(fromACObligationsSelector.isAvalCreditsCompleted);
  bogObligationsCompleted$: Observable<boolean> = this.store.select(fromACObligationsSelector.isBogCreditsCompleted);
  acObligationsError$: Observable<any> = this.store.select(fromACObligationsSelector.getAvalCreditsObligationError);
  cardsAcObligations$: Observable<CardACObligation[]> = this.store.select(fromACObligationsSelector.getCardsACObligations);



  constructor(private store: Store<AcObligationsState>) {
  }

  public fetchAvalCreditsObligations(): void {
    this.store.dispatch(new fromACObligationsActions.FetchACObligationsAction());
  }

  public removeACObligations(): void {
    this.store.dispatch(new fromACObligationsActions.RemoveACObligationsAction());
  }

  public addObligation(paymentObligation: PaymentObligation): void {
    this.store.dispatch(new fromACObligationsActions.AddObligationAction(paymentObligation));
  }

}

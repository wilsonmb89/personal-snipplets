import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { CCObligationsState } from '../states/cc-obligations.state';
import * as fromCCObligationsActions from '../actions/cc-obligations.action';
import * as fromCCObligationsSelector from '../selectors/cc-obligations.selector';
import { PaymentObligation } from '../../../../core/services-apis/transfer/transfer-core/models/payment-obligations.model';
import { CardCCObligation } from '../../../../../pages/payments/credit-card/cc-destination-acct/cc-destination-acct';

@Injectable()
export class CCObligationsFacade {

    ccObligations$: Observable<PaymentObligation[]> = this.store.select(fromCCObligationsSelector.getAllCCObligations);
    ccObligationsWorking$: Observable<boolean> = this.store.select(fromCCObligationsSelector.getAllCCObligationsWorking);
    ccObligationsCompleted$: Observable<boolean> = this.store.select(fromCCObligationsSelector.getAllCCObligationsCompleted);
    ccObligationsError$: Observable<any> = this.store.select(fromCCObligationsSelector.getAllCCObligationsError);

    cardsCCObligations$: Observable<CardCCObligation[]> = this.store.select(fromCCObligationsSelector.getAllCardsCCObligations);

    constructor(private store: Store<CCObligationsState>) { }

    public fetchCCObligations(): void {
        this.store.dispatch(new fromCCObligationsActions.FetchCCObligationsAction());
    }

    public removeCCObligations(): void {
        this.store.dispatch(new fromCCObligationsActions.RemoveCCObligationsAction());
    }

    public updateCCObligations(): void {
        this.removeCCObligations();
        this.fetchCCObligations();
    }

    public getCCObligations(): Observable<PaymentObligation[]> {
        return this.store.select(fromCCObligationsSelector.getAllCCObligations);
    }

}

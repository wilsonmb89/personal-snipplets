import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import * as fromCCObligationsActions from '../actions/cc-obligations.action';
import * as fromCCObligationsSelector from '../selectors/cc-obligations.selector';
import { withLatestFrom, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { CCObligationsState } from '../states/cc-obligations.state';
import { PaymentObligation } from '../../../../core/services-apis/transfer/transfer-core/models/payment-obligations.model';
import { CCobligationsService } from '../../services/cc-obligations.service';
import {BdbToastProvider} from '../../../../../providers/bdb-toast/bdb-toast';

@Injectable()
export class CCObligationsEffect {

    constructor(
        private actions$: Actions,
        private ccObligationsService: CCobligationsService,
        private store: Store<CCObligationsState>,
        private bdbToast: BdbToastProvider
    ) { }

    @Effect()
    fetchCCObligations$: Observable<Action> = this.actions$
        .ofType(fromCCObligationsActions.FETCH_CC_OBLIGATIONS)
        .concatMap(action => of(action).pipe(
            withLatestFrom(
                this.store.select(fromCCObligationsSelector.getAllCCObligations),
                this.store.select(fromCCObligationsSelector.getAllCCObligationsCompleted)
            )
        ))
        .mergeMap(([_, ccObligationsStore, complete]) => {
            if (complete) {
                return of(({
                    type: fromCCObligationsActions.FETCH_CC_OBLIGATIONS_SUCCESS,
                    paymentObligations: ccObligationsStore
                }));
            }
            return this.ccObligationsService.getCreditCardPaymentObligations()
                .pipe(
                    map((paymentObligations: PaymentObligation[]) => ({
                        type: fromCCObligationsActions.FETCH_CC_OBLIGATIONS_SUCCESS,
                        paymentObligations: paymentObligations
                    })),
                    catchError(
                    err => {
                      this.bdbToast.showToastGeneric({
                        message: 'Algunas de tus tarjetas no pudieron ser consultadas',
                        close: true,
                        color: 'toast-error',
                        type: 'delete'
                      });
                    return of({
                      type: fromCCObligationsActions.FETCH_CC_OBLIGATIONS_ERROR,
                      error: err
                    });
                    })
                );
        });
}

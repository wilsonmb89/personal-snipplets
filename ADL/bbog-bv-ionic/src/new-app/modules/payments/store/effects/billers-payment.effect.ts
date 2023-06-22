import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import * as fromBillersPaymentActions from '../actions/billers-payment.action';
import * as billerInfoListSelector from '../selectors/billers-payment.selector';
import { withLatestFrom, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { BillersPaymentState } from '../states/payment-core.state';
import { BillersPaymentService } from '../../services/billers-payment.service';
import { BillerInfoList } from '../../../../core/services-apis/payment-core/models/billers-payment.model';

@Injectable()
export class BillersPaymentEffect {

    constructor(
        private actions$: Actions,
        private billersPaymentService: BillersPaymentService,
        private store: Store<BillersPaymentState>
    ) { }

    @Effect()
    fetchBillersPayment$: Observable<Action> = this.actions$
        .ofType(fromBillersPaymentActions.FETCH_BILLERS_PAYMENT)
        .concatMap(action => of(action).pipe(
            withLatestFrom(
                this.store.select(billerInfoListSelector.getAllBillerInfoList),
                this.store.select(billerInfoListSelector.getAllBillerInfoListCompleted)
            )
        ))
        .mergeMap(([state, billerInfoListStore, complete]) => {
            if (complete) {
                return of(({
                    type: fromBillersPaymentActions.FETCH_BILLERS_PAYMENT_SUCCESS,
                    billerInfoList: billerInfoListStore
                }));
            }
            return this.billersPaymentService.getBillersPayment().pipe(
                map((billerInfoList: BillerInfoList[]) => ({
                    type: fromBillersPaymentActions.FETCH_BILLERS_PAYMENT_SUCCESS,
                    billerInfoList: billerInfoList
                })),
                catchError((err: any) => of({
                    type: fromBillersPaymentActions.FETCH_BILLERS_PAYMENT_ERROR,
                    error: err
                }))
            );
        });
}

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { AcObligationsState } from '../states/ac-obligations.state';
import { Observable } from 'rxjs/Observable';
import * as fromACObligationsActions from '../actions/ac-obligations.action';
import { of } from 'rxjs/observable/of';
import { catchError, first, map, switchMap, tap } from 'rxjs/operators';
import * as fromACObligations from '../selectors/ac-obligations.selector';
import {ErrorMapperType} from '../../../../core/http/http-client-wrapper/http-client-wrapper.service';
import {BdbToastProvider} from '../../../../../providers/bdb-toast/bdb-toast';
import { TransferCoreService } from '@app/apis/transfer/transfer-core/transfer-core.service';


@Injectable()
export class ACObligationsEffect {

  constructor(
    private actions$: Actions,
    private store: Store<AcObligationsState>,
    private transferCoreService: TransferCoreService,
    private bdbToast: BdbToastProvider
  ) {
  }

  @Effect()
  fetchBogCreditsObligations$: Observable<Action> = this.actions$
    .ofType(fromACObligationsActions.FETCH_AC_OBLIGATIONS)
    .pipe(
      switchMap((_) => this.store.select(fromACObligations.isBogCreditsCompleted).pipe(first())),
      switchMap((isBogCreditsCompleted) => {
        if (!isBogCreditsCompleted) {
          return this.transferCoreService.getBBOGPaymentObligations().pipe(
            map(({paymentObligations}) => ({
              type: fromACObligationsActions.FETCH_BOG_OBLIGATIONS_SUCCESS,
              bogCreditsObligations: paymentObligations
            })),
            catchError(error =>
              error.errorType === ErrorMapperType.DataDoesNotExist ?
                of(({ type: fromACObligationsActions.FETCH_BOG_OBLIGATIONS_SUCCESS, bogCreditsObligations: [] })) :
                of(({ type: fromACObligationsActions.FETCH_AC_OBLIGATIONS_ERROR }))
            )
          );
        }
        return of(({ type: fromACObligationsActions.FETCH_AC_OBLIGATIONS_SKIP }));
      })
    );

    @Effect()
    fetchAvalCreditsObligations$: Observable<Action> = this.actions$
      .ofType(fromACObligationsActions.FETCH_AC_OBLIGATIONS)
      .pipe(
        switchMap((_) => this.store.select(fromACObligations.isAvalCreditsCompleted).pipe(first())),
        switchMap((isAvalCreditsCompleted) => {
          if (!isAvalCreditsCompleted) {
            return this.transferCoreService.getAVALPaymentObligations().pipe(
              map(({paymentObligations}) => ({
                type: fromACObligationsActions.FETCH_AVAL_OBLIGATIONS_SUCCESS,
                avalCreditsObligations: paymentObligations
              })),
              catchError(error =>
                error.errorType === ErrorMapperType.DataDoesNotExist ?
                  of(({ type: fromACObligationsActions.FETCH_AVAL_OBLIGATIONS_SUCCESS, avalCreditsObligations: [] })) :
                  of(({ type: fromACObligationsActions.FETCH_AC_OBLIGATIONS_ERROR }))
              )
            );
          }
          return of(({ type: fromACObligationsActions.FETCH_AC_OBLIGATIONS_SKIP }));
        })
      );

    @Effect({ dispatch: false })
    fetchCreditsObligationsError$: Observable<Action> = this.actions$
      .ofType(fromACObligationsActions.FETCH_AC_OBLIGATIONS_ERROR)
      .pipe(
        tap( error => {
          this.bdbToast.showToastGeneric({
            message: 'Alguno de tus créditos no pudo ser consultado',
            close: true,
            color: 'toast-error',
            type: 'delete'
          });
        })
      );
}

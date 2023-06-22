import * as digitalCdtBalancesActions from '../actions/digital-cdt-balances.action';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProductsDetailService } from '../../../../core/services-apis/products/products-detail/products-detail.service';

@Injectable()
export class DigitalCDTBalancesEffects {
  @Effect()
  getDigitalCDTBalancesEffect$: Observable<Action> = this.actions$
    .ofType(digitalCdtBalancesActions.GET_CDT_DIGITAL_BALANCES)
    .pipe(
      switchMap((_) => this.productsDetailService.getCdtCustomer().pipe(
        map((res) => ({
          type: digitalCdtBalancesActions.GET_CDT_DIGITAL_BALANCES_SUCCESS,
          digitalCdtBalances: res.productBalanceInfoList
        })),
        catchError((error) => of({ type: digitalCdtBalancesActions.GET_CDT_DIGITAL_BALANCES_ERROR }))
      )),
    );

  constructor(private productsDetailService: ProductsDetailService, private actions$: Actions) {}
}

import * as digitalCdtRenewalActions from '../actions/digital-cdt-renewal.action';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { ProductsService } from '../../../../core/services-apis/products/products/products.service';

@Injectable()
export class DigitalCDTRenewalEffects {
    @Effect()
    getDigitalCDTBalancesEffect$: Observable<Action> = this.actions$
        .ofType(digitalCdtRenewalActions.SET_DIGITAL_CDT_RENEWAL)
        .pipe(
            concatMap((action: any) => of(action)),
            switchMap((action) => this.productsService.cdtRenewal(action.cdtRenewalRequest).pipe(
                map((res) => ( res.status === 'OK' ?
                    {
                        type: digitalCdtRenewalActions.SET_DIGITAL_CDT_RENEWAL_SUCCESS,
                        cdtRenewalResponse: res
                    }
                    : { type: digitalCdtRenewalActions.SET_DIGITAL_CDT_RENEWAL_ERROR }
                )),
                catchError((error) => of({ type: digitalCdtRenewalActions.SET_DIGITAL_CDT_RENEWAL_ERROR }))
            )),
        );

    constructor(private productsService: ProductsService, private actions$: Actions) { }
}

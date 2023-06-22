import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, switchMap, map } from 'rxjs/operators';
import { CustomerSecurityService } from '../../../../core/services-apis/customer-security/customer-security.service';
import { ProductsService } from '../../../../core/services-apis/products/products/products.service';
import * as creditCardActions from '../actions/credit-card.action';

@Injectable()
export class CreditCardEffect {
  constructor(
    private actions$: Actions,
    private customerSecurityService: CustomerSecurityService,
    private productsService: ProductsService
  ) {}

  @Effect()
  creditCardAccountInfoEffect$: Observable<Action> = this.actions$
  .ofType(creditCardActions.CARD_ACCOUNT_INFO)
  .pipe(
    concatMap((action: any) => of(action)),
    switchMap((action) => this.productsService.creditCardAccountInfo(action.creditCardAccountInfoRq).pipe(
      map((res) => (res ?
        {
          type: creditCardActions.CARD_ACCOUNT_INFO_SUCCESS,
          creditCardAccountInfoRs: res
        } :
        {
          type: creditCardActions.CARD_ACCOUNT_INFO_ERROR,
          errorResponse: res
        }
      )),
      catchError((error) => of({
        type: creditCardActions.CARD_ACCOUNT_INFO_ERROR,
        errorResponse: error
      }))
    ))
  );

  @Effect()
  creditCardActivationEffect$: Observable<Action> = this.actions$
  .ofType(creditCardActions.CARD_ACTIVATION)
  .pipe(
    concatMap((action: any) => of(action)),
    switchMap((action) =>  this.customerSecurityService.creditCardActivation(action.creditCardActivationRq).pipe(
      map((res) => (res ?
        {
          type: creditCardActions.CARD_ACTIVATION_SUCCESS,
          creditCardActivationRs: res
        } :
        {
          type: creditCardActions.CARD_ACTIVATION_ERROR,
          errorResponse: res
        }
      )),
      catchError((error) => of({
        type: creditCardActions.CARD_ACTIVATION_ERROR,
        errorResponse: error
      }))
    ))
  );

  @Effect()
  creditCardBlockEffect$: Observable<Action> = this.actions$
  .ofType(creditCardActions.CARD_BLOCKING)
  .pipe(
    concatMap((action: any) => of(action)),
    switchMap((action) => this.customerSecurityService.creditCardBlock(action.creditCardBlockRq).pipe(
      map((res) => (res ?
        {
          type: creditCardActions.CARD_BLOCKING_SUCCESS,
          creditCardBlockRs: res
        } :
        {
          type: creditCardActions.CARD_BLOCKING_ERROR,
          errorResponse: res
        }
      )),
      catchError((error) => of({
        type: creditCardActions.CARD_BLOCKING_ERROR,
        errorResponse: error
      }))
    ))
  );

  @Effect()
  creditCardUnblockEffect$: Observable<Action> = this.actions$
  .ofType(creditCardActions.CARD_UNBLOCK)
  .pipe(
    concatMap((action: any) => of(action)),
    switchMap((action) => this.customerSecurityService.creditCardUnblock(action.creditCardUnblockRq).pipe(
      map((res) => (res ?
        {
          type: creditCardActions.CARD_UNBLOCK_SUCCESS,
          creditCardUnblockRs: res
        } :
        {
          type: creditCardActions.CARD_UNBLOCK_ERROR,
          errorResponse: res
        }
      )),
      catchError((error) => of({
        type: creditCardActions.CARD_UNBLOCK_ERROR,
        errorResponse: error
      }))
    ))
  );

}

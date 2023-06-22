import * as productsActions from '../actions/products.action';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProductsService } from '../../../../core/services-apis/products/products/products.service';

@Injectable()
export class ProductsEffects {
  @Effect()
  getProductsEffect$: Observable<Action> = this.actions$
    .ofType(productsActions.GET_PRODUCTS)
    .pipe(
      switchMap((_) => this.productsService.getAll().pipe(
        map((productsRq) => ({
          type: productsActions.GET_PRODUCTS_SUCCESS,
          products: productsRq.accountList,
        })),
        catchError((error) => of({ type: productsActions.GET_PRODUCTS_ERROR }))
      )),
    );

  constructor(private productsService: ProductsService, private actions$: Actions) {}
}

import * as balancesActions from '../actions/balances.action';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { productsSelector } from '../selectors/products.selector';
import { ProductsState } from '../states/products.state';
import { BalanceType, ProductsDetailService } from '../../../../core/services-apis/products/products-detail/products-detail.service';
import { ApiProductDetail } from '../../../../core/services-apis/products/products/models/products';
import { ProductInfo } from '../../../../core/services-apis/products/products-detail/models/GetBalanceRq';
import { ProductBalanceInfo } from '../../../../core/services-apis/products/products-detail/models/GetBalanceRs';
import { getStrategy } from '@app/delegate/products-detail-delegate/strategy/products-detail-strategies';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class BalancesEffects {
  @Effect()
  getBalancesEffect$: Observable<Action> = this.actions$
    .ofType(balancesActions.GET_BALANCES)
    .pipe(
      switchMap((_) => this.store.select(productsSelector)),
      switchMap((products) => this.getBalances(products)),
      map((balances) => ({ type: balancesActions.GET_BALANCES_SUCCESS, balances })),
      catchError((error) => of({ type: balancesActions.GET_BALANCES_ERROR }))
    );

  constructor(
    private productsDetailService: ProductsDetailService,
    private store: Store<ProductsState>,
    private actions$: Actions
  ) {}

  private getBalances(products: ApiProductDetail[]): Observable<ProductBalanceInfo[]> {
    const requests$ = products.map(product => this.getBalanceByStrategy(product));
    return forkJoin(...requests$);
  }

  private getBalanceByStrategy(productDetail: ApiProductDetail): Observable<ProductBalanceInfo> {
    const strategy = getStrategy(productDetail);
    return !!strategy
      ? this.getBalance(productDetail, strategy.balanceType())
      : Observable.throw(
          'Strategy not found for product ' + productDetail.productBankType
        );
  }

  private getBalance(productDetails: ApiProductDetail, resource: BalanceType): Observable<ProductBalanceInfo> {
    const productsInfo = [this.buildGetBalanceRq(productDetails)];
    return this.productsDetailService
      .getBalance({ productsInfo }, resource)
      .pipe(map((value) => value.productBalanceInfoList[0]));
  }

  private buildGetBalanceRq(product: ApiProductDetail): ProductInfo {
    return {
      acctId: product.productNumber,
      acctSubType: product.productBankSubType,
      acctType: product.productBankType,
      officeId: product.officeId,
      refId: '',
      refType: '',
    };
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as productsActions from '../actions/products.action';
import * as digitalCdtBalancesActions from '../actions/digital-cdt-balances.action';
import * as balancesActions from '../actions/balances.action';
import * as digitalCdtRenewalActions from '../actions/digital-cdt-renewal.action';
import * as productsSelector from '../selectors/products.selector';
import { ProductsState } from '../states/products.state';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';
import { CdtRenewalRequest } from '@app/modules/products/models/cdt-renewal-request';
import {BdbInMemoryProvider} from '../../../../../providers/storage/bdb-in-memory/bdb-in-memory';

@Injectable()
export class ProductsFacade {
  productsState$: Observable<ProductsState> = this.store.select(productsSelector.productsState);

  getDigitalCdtById$: (accountId: string) => Observable<ProductBalanceInfo> = (accountId: string) =>
  this.store.select(productsSelector.getDigitalCdtSelector(accountId))

  constructor(private store: Store<ProductsState>, public bdbInMemoryProvider: BdbInMemoryProvider) {}

  public getProducts(): void {
    this.store.dispatch(new productsActions.GetProductsAction());
  }

  // TODO: Remove this action when old dashboard be removed
  public setProducts(products: ApiProductDetail[]): void {
    this.store.dispatch(new productsActions.SetProductsAction(products));
  }

  // TODO: Remove this action when old dashboard be removed
  public setDigitalCDTBalances(digitalCdtBalances: ProductBalanceInfo[]): void {
    this.store.dispatch(new digitalCdtBalancesActions.SetDigitalCdtBalancesAction(digitalCdtBalances));
  }

  // TODO: Remove this action when old dashboard be removed
  public addBalance(balance: ProductBalanceInfo): void {
    this.store.dispatch(new balancesActions.AddBalanceAction(balance));
  }

  public setDigitalCDTRenewal(cdtRenewalResponse: CdtRenewalRequest) {
    this.store.dispatch(new digitalCdtRenewalActions.SetDigitalCdtRenewalAction(cdtRenewalResponse));
  }

}

import { Injectable } from '@angular/core';
import { GetBalancesByAccountRs } from './aval-ops-models';
import { Observable } from 'rxjs/Observable';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { catchError, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ProductsDelegateService } from '../../new-app/core/services-delegate/products-delegate/products-delegate.service';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';
import { ProductsDetailDelegateService } from '../../new-app/core/services-delegate/products-detail-delegate/products-detail-delegate.service';
import {BdbStorageService} from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import {mapDetailsBalance, ProductDetail} from '../../app/models/products/product-model';
import {BdbConstants} from '../../app/models/bdb-generics/bdb-constants';
import {BalanceUtilsService} from '@app/shared/utils/bdb-balance-utils/balance-utils.service';

@Injectable()
export class AvalOpsProvider {

  private ACTIVE = 'A';

  constructor(
    private productsDelegateService: ProductsDelegateService,
    private productsDetailDelegateService: ProductsDetailDelegateService,
    private bdbStorageService: BdbStorageService,
    private balanceUtilsService: BalanceUtilsService
  ) {
  }

  public getAccountListByBank(): Observable<ProductDetail[]> {

    return forkJoin(
      this.productsDelegateService.getProducts(),
      this.getCdtListCustomer()
    ).pipe(
      map(([acctListNew, cdtListCustomer]: [ProductDetail[], ProductBalanceInfo[]]) => {
        const productsDetail: ProductDetail[] = [...acctListNew];

        const listMappedOfCdt = cdtListCustomer.map(value => {
          const termType = {
            'Years': 'Años',
            'Months': 'Meses',
            'Days': 'Días',
            '': undefined
          };
          const productDetail = new ProductDetail();
          productDetail.productName = 'CDT Digital';
          productDetail.productNumber = value.accountId;
          productDetail.amount = value.balanceDetail['Total Amt'];
          productDetail.productTypeBDB = value.accountType;
          productDetail.description = 'Saldo Disponible';
          productDetail.productType = 'CD';
          productDetail.balanceDetail = {
            CDTEfficiencyBBOG: value['grossInterest'],
            CDTRateBBOG: value.balanceDetail.CDT_RATE,
            CDTAmountBBOG: value.balanceDetail['Total Amt'],
            CDTRetentionBBOG: value['withHolding'],
            CDTCreationDate: value['createdAt'] ? value['createdAt'].replace(/-/g, '/') : undefined,
            CDTDurationBBOG: value['termType'] ? `${value['term']} ${termType[value['termType']]}` : undefined,
            CDTRenovationIsActive: !(value['renewal'] === '2'),
            CDTExpirationBBOG: value.expDate,
          };
          return productDetail;
        });


        const finalProductsActive = productsDetail.filter(value => value.productDetailApi.status === this.ACTIVE);
        const finalProductsInActive = productsDetail.filter(value => value.productDetailApi.status !== this.ACTIVE);

        const finalProducts = finalProductsActive.concat(listMappedOfCdt);

        this.bdbStorageService.setItemByKey(InMemoryKeys.CustomerProductListInActive, finalProductsInActive);
        this.bdbStorageService.setItemByKey(InMemoryKeys.CustomerProductList, finalProducts);

        return finalProducts;
      })
    );
  }

  private getCdtListCustomer(): Observable<ProductBalanceInfo[]> {
    return this.productsDelegateService.getCdtCustomer().pipe(
      catchError(err => Observable.of([]))
    );
  }

  public getBalancesByAccount(productDetail: ProductDetail): Observable<GetBalancesByAccountRs> {
    return this.productsDetailDelegateService.getBalanceMappedToOld(productDetail.productDetailApi);
  }

  private clearProducts(): void {
    this.bdbStorageService.setItemByKey(InMemoryKeys.CustomerProductList, null);
  }

  public refreshProductsInfo(): void {
    this.clearProducts();
    this.getAccountListByBank().subscribe((balance) => {
      this.getUknownBalance(balance);
    });
  }

  private getUknownBalance(customerProductList: ProductDetail[]): void {
    customerProductList.filter((e: ProductDetail) => e.description === BdbConstants.UNKNOWN)
      .forEach((f: ProductDetail) => {
        this.getBalancesByAccount(f).subscribe(
          (balance: GetBalancesByAccountRs) => {
            const bDetail = mapDetailsBalance(balance.details);
            f.balanceDetail = bDetail;
            const key = this.balanceUtilsService.getAmountKeyByProduct(f);
            f.amount = f.balanceDetail[key];
            this.bdbStorageService.setItemByKey(InMemoryKeys.CustomerProductList, customerProductList);
          }
        );
      });
  }

}

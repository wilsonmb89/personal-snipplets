import { Injectable } from '@angular/core';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { Observable } from 'rxjs/Observable';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';
import {
  BalanceType,
  ProductsDetailService
} from '@app/apis/products/products-detail/products-detail.service';
import { map, tap } from 'rxjs/operators';
import { GetBalanceRq } from '@app/apis/products/products-detail/models/GetBalanceRq';
import { getStrategy } from './strategy/products-detail-strategies';
import { GetBalancesByAccountRs } from '../../../../providers/aval-ops/aval-ops-models';
import { ProductsFacade } from '@app/shared/store/products/facades/products.facade';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';


@Injectable()
export class ProductsDetailDelegateService {

  private bankId = BdbConstants.BBOG_CODE;


  constructor(
    private productsDetailService: ProductsDetailService,
    private productsFacade: ProductsFacade
  ) {
  }


  public getBalanceMappedToOld(productDetail: ApiProductDetail): Observable<GetBalancesByAccountRs> {
    const strategy = getStrategy(productDetail);
    if (!!strategy) {
      return this.getBalanceFromService(
        productDetail,
        strategy.balanceType()
      ).pipe(
        tap(productBalanceInfo => this.productsFacade.addBalance(productBalanceInfo)),
        map(productBalanceInfo => strategy.mapperToOld(productBalanceInfo, productDetail.productAthType, this.bankId))
      );
    } else {
      Observable.throw('Strategy not found for product ' + productDetail.productBankType);
    }
  }

  public getBalance(productDetail: ApiProductDetail): Observable<ProductBalanceInfo> {
    const strategy = getStrategy(productDetail);
    if (!!strategy) {
      return this.getBalanceFromService(
        productDetail,
        strategy.balanceType()
      );
    } else {
      Observable.throw('Strategy not found for product ' + productDetail.productBankType);
    }
  }

  private getBalanceFromService(productDetails: ApiProductDetail, resource: BalanceType): Observable<ProductBalanceInfo> {
    return this.productsDetailService.getBalance(
      this.buildGetBalanceRq([productDetails]),
      resource
    ).pipe(map(value => value.productBalanceInfoList[0]));
  }

  private buildGetBalanceRq(productDetails: ApiProductDetail[]): GetBalanceRq {
    return {
      productsInfo: productDetails.map(product => {
        return {
          acctId: product.productNumber,
          acctSubType: product.productBankSubType,
          acctType: product.productBankType,
          officeId: product.officeId,
          refId: '',
          refType: ''
        };
      })
    };
  }

  public getCdtCustomer(): Observable<ProductBalanceInfo[]> {
    return this.productsDetailService.getCdtCustomer().pipe(map(value => value.productBalanceInfoList));
  }

}

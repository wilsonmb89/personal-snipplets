import { Injectable } from '@angular/core';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';
import { ProductsDetailService } from '@app/apis/products/products-detail/products-detail.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { ProductsService } from '@app/apis/products/products/products.service';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { of } from 'rxjs/observable/of';
import { ProductsFacade } from '@app/shared/store/products/facades/products.facade';
import { ATHTypes } from '@app/shared/utils/bdb-constants/products-constants';
import { BdbRsaProvider } from '../../../../providers/bdb-rsa/bdb-rsa';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import {ProductDetail} from '../../../../app/models/products/product-model';


const BANK_ID = BdbConstants.BBOG_CODE;
const BANK = 'Banco de Bogotá';
const IS_AVAL = true;
const DESCRIPTION = 'UNKNOWN';


@Injectable()
export class ProductsDelegateService {

  constructor(
    private productsDetailService: ProductsDetailService,
    private productsService: ProductsService,
    private bdbStorageService: BdbStorageService,
    private productsFacade: ProductsFacade,
    private bdbRsaProvider: BdbRsaProvider) {
  }


  public getProductsNotMapped(): Observable<ApiProductDetail[]> {
    return this.productsService.getAll().pipe(
      tap(response => this.productsFacade.setProducts(response.accountList)),
      map(dataFromApi =>
        dataFromApi.accountList
      ),
      tap(dataFromApi =>
        this.bdbStorageService.setItemByKey(InMemoryKeys.CustomerProductListApi, dataFromApi)
      )
    );
  }

  public getProducts(): Observable<ProductDetail[]> {
    return this.productsService.getAll( {
      statusesToFilter: ['ALL']
    } ).pipe(
      tap(response => this.productsFacade.setProducts(response.accountList)),
      map(dataFromApi => dataFromApi.accountList),
      map((products: ApiProductDetail[]) => products.map((product): ProductDetail => ({
        productBank: BANK,
        bankId: this.bdbRsaProvider.encrypt(BANK_ID), // CIFRADO
        isAval: IS_AVAL,
        productName: product.productName,
        productType: product.productAthType,
        productNumber: this.mapProductNumber(product),
        productNumberX: this.bdbRsaProvider.encrypt(product.productNumber), // CIFRADO
        description: DESCRIPTION,
        category: this.getCategory(product.productBankType),
        amount: null,
        isActive: false,
        productDetailApi: product,
        productNumberApi: product.productNumber,
        openDt: !!product.openDate ? product.openDate : '',
        franchise: product.franchise,
        productTypeBDB: !!product.productBankType ? product.productBankType : '',
        favorite: false, // TODO: validate if not use (TransfersDestinationAcctPage.ts)
        favoriteTime: new Date().getDate() // TODO: validate if not use (TransfersDestinationAcctPage.ts)

      })))
    );
  }


  private mapProductNumber(product: ApiProductDetail): string {
    switch (product.productAthType) {
      case ATHTypes.ST:
      case ATHTypes.IM:
      case ATHTypes.AF:
        return product.productNumber.substr(product.productNumber.length - 9);
      case ATHTypes.MC:
      case ATHTypes.CB:
      case ATHTypes.BNPL:
        return `*****${product.productNumber.substr(product.productNumber.length - 4)}`;
      case ATHTypes.FB:
        return `${product.productBankSubType.substr(0, 3)}${product.productNumber}`;
      default:
        return product.productNumber;
    }
  }


  private getCategory(productType: string): string {
    const mapper = {
      AFC: 'AC',
      DDA: 'AC',
      SDA: 'AC',
      CDA: 'DT',
      DLA: 'CR',
      CCA: 'TC',
      LOC: 'CR',
      FDA: 'FD'
    };
    if (!!mapper[productType]) {
      return mapper[productType];
    } else {
      console.error('_____________ ERROR MAP CATEGORY for product => ', productType);
      return 'NA';
    }
  }


  public getCdtCustomer(): Observable<ProductBalanceInfo[]> {
    const data = this.bdbStorageService.getItemByKey(InMemoryKeys.CdtCustomerData);

    return (!!data) ? of(data) :
      this.productsDetailService.getCdtCustomer().pipe(
        tap(response => this.productsFacade.setDigitalCDTBalances(response.productBalanceInfoList)),
        map(value => value.productBalanceInfoList),
        tap(dataFromApi => {
          this.bdbStorageService.setItemByKey(InMemoryKeys.CdtCustomerData, dataFromApi);
        })
      );
  }

}

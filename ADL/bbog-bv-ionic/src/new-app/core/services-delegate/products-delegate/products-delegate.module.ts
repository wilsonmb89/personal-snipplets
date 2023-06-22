import { NgModule } from '@angular/core';
import { LoyaltyDelegateService } from './loyalty-delegate.service';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { ProductsApisModule } from '@app/apis/products/products-apis.module';
import { CardsInfoDelegateService } from './cards-info-delegate.service';
import { ProductsDelegateService } from '@app/delegate/products-delegate/products-delegate.service';
import { AvalProductsDelegateService } from '@app/delegate/products-delegate/aval-products-delegate.service';
import { TransferApisModule } from '@app/apis/transfer/transfer-apis.module';
import { ProductsDetailDelegateService } from '@app/delegate/products-detail-delegate/products-detail-delegate.service';


@NgModule({
  declarations: [],
  imports: [
    ProductsApisModule,
    TransferApisModule,
    BdbUtilsModule

  ],
  providers: [
    ProductsDelegateService,
    LoyaltyDelegateService,
    CardsInfoDelegateService,
    AvalProductsDelegateService,
    ProductsDetailDelegateService
  ]
})
export class ProductsDelegateModule {
}

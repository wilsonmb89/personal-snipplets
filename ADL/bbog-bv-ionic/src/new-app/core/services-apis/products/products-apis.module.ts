import { NgModule } from '@angular/core';
import { BdbHttpModule } from '../../http/bdb-http.module';
import { ProductsService } from './products/products.service';
import { ProductsDetailService } from './products-detail/products-detail.service';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { AvalProductsService } from '@app/apis/products/aval-products/aval-products.service';



@NgModule({
  declarations: [],
  imports: [BdbHttpModule, BdbUtilsModule],
  providers: [
    ProductsService,
    ProductsDetailService,
    AvalProductsService
  ]
})
export class ProductsApisModule {}

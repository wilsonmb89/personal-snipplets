import { NgModule } from '@angular/core';
import { ProductsApisModule } from '@app/apis/products/products-apis.module';
import { EnrollCustomCardDelegateService } from '@app/delegate/enroll-custom-card-delegate/enroll-custom-card-delegate.service';

@NgModule({
  imports: [
    ProductsApisModule
  ],
  providers: [
    EnrollCustomCardDelegateService
  ]
})
export class EnrollCustomCardModule {}

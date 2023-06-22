import { NgModule } from '@angular/core';

import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { PaymentBillersApiService } from '../../services-apis/payment-billers/payment-billers-api.service';
import { PayBillDelegateService } from './pay-bill-delegate.service';
import { CheckPaymentTaxDelegateService } from './check-payment-tax-delegate.service';
import { DistrictTaxDelegateService } from './district-tax-delegate';
import { PayDianDelegateService } from './pay-dian-delegate.service';


@NgModule({
  declarations: [],
  imports: [
    BdbUtilsModule
  ],
  providers: [
    PayBillDelegateService,
    PayDianDelegateService,
    CheckPaymentTaxDelegateService,
    PaymentBillersApiService,
    DistrictTaxDelegateService,
  ]
})
export class PaymentBillersDelegateModule {}

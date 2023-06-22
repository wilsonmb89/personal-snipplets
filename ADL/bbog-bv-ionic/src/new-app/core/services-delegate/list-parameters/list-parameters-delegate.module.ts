import { NgModule } from '@angular/core';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { ListPaymentAgreementDelegate } from './list-payment-agreement-delegate.service';
import { TransferApisModule } from '@app/apis/transfer/transfer-apis.module';
import { PaymentCoreApiModule } from '@app/apis/payment-core/payment-core-api.module';

@NgModule({
  declarations: [],
  imports: [
    TransferApisModule,
    PaymentCoreApiModule,
    BdbUtilsModule],
  providers: [
    ListPaymentAgreementDelegate
  ]
})
export class ListParametersDelegateModule {
}

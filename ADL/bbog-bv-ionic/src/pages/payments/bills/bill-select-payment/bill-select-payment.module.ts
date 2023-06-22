import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { BillSelectPaymentPage } from './bill-select-payment';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { TransactionResultPaymentsModule } from '@app/shared/modules/transaction-result/services/payments/transaction-result-payments.module';
import { PaymentBillersDelegateModule } from '@app/delegate/payment-billers-delegate/payment-billers-delegate.module';

@NgModule({
  declarations: [
    BillSelectPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(BillSelectPaymentPage),
    ComponentsModule,
    DirectivesModule,
    TransactionResultPaymentsModule,
    PaymentBillersDelegateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class BillSelectPaymentPageModule {}

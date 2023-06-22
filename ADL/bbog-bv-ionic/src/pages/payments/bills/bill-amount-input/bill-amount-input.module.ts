import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { BillAmountInputPage } from './bill-amount-input';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { TransactionResultPaymentsModule } from '@app/shared/modules/transaction-result/services/payments/transaction-result-payments.module';
import { PaymentBillersDelegateModule } from '@app/delegate/payment-billers-delegate/payment-billers-delegate.module';

@NgModule({
  declarations: [
    BillAmountInputPage,
  ],
  imports: [
    IonicPageModule.forChild(BillAmountInputPage),
    ComponentsModule,
    DirectivesModule,
    TransactionResultPaymentsModule,
    PaymentBillersDelegateModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class BillAmountInputPageModule {}

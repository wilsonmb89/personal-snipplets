import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaxFromAccountPage } from './tax-from-account';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { PaymentBillersDelegateModule } from '../../../../new-app/core/services-delegate/payment-billers-delegate/payment-billers-delegate.module';
import { TransactionResultPaymentsModule } from '@app/shared/modules/transaction-result/services/payments/transaction-result-payments.module';


@NgModule({
  declarations: [
    TaxFromAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(TaxFromAccountPage),
    ComponentsModule,
    DirectivesModule,
    PaymentBillersDelegateModule,
    TransactionResultPaymentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaxFromAccountPageModule {}

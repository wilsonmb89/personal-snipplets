import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PilaFromAccountPage } from './pila-from-account';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { TransactionResultPaymentsModule } from '@app/shared/modules/transaction-result/services/payments/transaction-result-payments.module';
import { PaymentBillersApiService } from '../../../../new-app/core/services-apis/payment-billers/payment-billers-api.service';


@NgModule({
  declarations: [
    PilaFromAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(PilaFromAccountPage),
    ComponentsModule,
    DirectivesModule,
    TransactionResultPaymentsModule
  ],
  providers: [
    PaymentBillersApiService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class PilaFromAccountPageModule {}

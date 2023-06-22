import { NgModule, Directive, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmountInputPage } from './amount-input';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { TransactionResultPaymentsModule } from '@app/shared/modules/transaction-result/services/payments/transaction-result-payments.module';

@NgModule({
  declarations: [
    AmountInputPage,
  ],
  imports: [
    IonicPageModule.forChild(AmountInputPage),
    ComponentsModule,
    DirectivesModule,
    TransactionResultPaymentsModule
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AmountInputPageModule {}

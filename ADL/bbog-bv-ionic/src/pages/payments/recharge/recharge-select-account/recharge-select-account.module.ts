import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RechargeSelectAccountPage } from './recharge-select-account';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { TransactionResultPaymentsModule } from '@app/shared/modules/transaction-result/services/payments/transaction-result-payments.module';

@NgModule({
  declarations: [
    RechargeSelectAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(RechargeSelectAccountPage),
    ComponentsModule,
    DirectivesModule,
    TransactionResultPaymentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RechargeSelectAccountPageModule {}

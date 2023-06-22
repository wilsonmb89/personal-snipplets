import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanSelectPaymentPage } from './loan-select-payment';
import { DirectivesModule } from '../../../../directives/directives.module';
import { ComponentsModule } from '../../../../components/components.module';
import {PaymentsModule} from '../../../../new-app/modules/payments/payments.module';
import {BdbUtilsModule} from '@app/shared/utils/bdb-utils.module';
import {GenericModalModule} from '@app/shared/components/modals/generic-modal/generic-modal.module';
import { LoanOpsProvider } from '../../../../providers/loan-ops/loan-ops';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';

@NgModule({
  declarations: [
    LoanSelectPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanSelectPaymentPage),
    ComponentsModule,
    DirectivesModule,
    PaymentsModule,
    BdbUtilsModule,
    GenericModalModule,
    TransactionResultTrasfersModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LoanOpsProvider
  ]
})
export class LoanSelectPaymentPageModule {}

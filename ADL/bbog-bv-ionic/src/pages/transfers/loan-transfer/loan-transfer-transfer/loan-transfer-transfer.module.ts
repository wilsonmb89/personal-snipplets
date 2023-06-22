import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoanTransferTransferPage } from './loan-transfer-transfer';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';
import { LoanOpsProvider } from '../../../../providers/loan-ops/loan-ops';

@NgModule({
  declarations: [
    LoanTransferTransferPage,
  ],
  imports: [
    IonicPageModule.forChild(LoanTransferTransferPage),
    ComponentsModule,
    DirectivesModule,
    TransactionResultTrasfersModule
  ],
  providers: [
    LoanOpsProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class LoanTransferTransferPageModule {}

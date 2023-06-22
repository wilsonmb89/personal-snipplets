import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashAdvanceTransferPage } from './cash-advance-transfer';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { CashAdvanceOpsProvider } from '../../../../providers/cash-advance-ops/cash-advance-ops';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';
import { InternalTransferDelegateModule } from '@app/delegate/internal-transfer-delegate/internal-transfer-delegate.module';

@NgModule({
  declarations: [
    CashAdvanceTransferPage,
  ],
  providers: [
    CashAdvanceOpsProvider
  ],
  imports: [
    IonicPageModule.forChild(CashAdvanceTransferPage),
    ComponentsModule,
    DirectivesModule,
    TransactionResultTrasfersModule,
    InternalTransferDelegateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CashAdvanceTransferPageModule {}

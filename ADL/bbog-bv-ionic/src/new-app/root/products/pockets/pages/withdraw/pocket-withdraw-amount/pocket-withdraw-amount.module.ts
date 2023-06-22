import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PocketWithdrawAmountPage } from './pocket-withdraw-amount';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { DirectivesModule } from '../../../../../../../directives/directives.module';
import { PocketOpsService } from '../../../services/pocket-ops.service';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';

@NgModule({
  declarations: [
    PocketWithdrawAmountPage,
  ],
  imports: [
    IonicPageModule.forChild(PocketWithdrawAmountPage),
    ComponentsModule,
    DirectivesModule,
    TransactionResultTrasfersModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    PocketOpsService
  ]
})
export class PocketWithdrawAmountPageModule {}

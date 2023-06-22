import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PocketDepositAmountPage } from './pocket-deposit-amount';
import { ComponentsModule } from '../../../../../../../components/components.module';
import { DirectivesModule } from '../../../../../../../directives/directives.module';
import { PocketOpsService } from '../../../services/pocket-ops.service';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';

@NgModule({
  declarations: [
    PocketDepositAmountPage,
  ],
  imports: [
    IonicPageModule.forChild(PocketDepositAmountPage),
    ComponentsModule,
    DirectivesModule,
    TransactionResultTrasfersModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    PocketOpsService
  ]
})
export class PocketDepositAmountPageModule { }

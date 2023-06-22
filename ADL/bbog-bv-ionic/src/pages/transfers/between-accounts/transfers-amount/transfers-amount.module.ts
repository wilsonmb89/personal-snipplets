import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from '../../../../components/components.module';
import { TransfersAmountPage } from './transfers-amount';
import { DirectivesModule } from '../../../../directives/directives.module';
import { AvalInProgressService } from '@app/shared/components/tx-in-progress/services/aval-in-progress.service';
import { TxInProgressModule } from '@app/shared/components/tx-in-progress/tx-in-progress.module';
import { AchInProgressService } from '@app/shared/components/tx-in-progress/services/ach-in-progress.service';
import { GenericModalModule } from '@app/shared/components/modals/generic-modal/generic-modal.module';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';

@NgModule({
  declarations: [
    TransfersAmountPage,
  ],
  providers: [
    AvalInProgressService,
    AchInProgressService
  ],
  imports: [
    IonicPageModule.forChild(TransfersAmountPage),
    ComponentsModule,
    DirectivesModule,
    TxInProgressModule,
    GenericModalModule,
    TransactionResultTrasfersModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class TransfersAmmountInputPageModule { }

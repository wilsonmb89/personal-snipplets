import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AmountSelectPage } from './amount-select';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import {PaymentsModule} from '../../../../new-app/modules/payments/payments.module';
import {BdbUtilsModule} from '@app/shared/utils/bdb-utils.module';
import {GenericModalModule} from '@app/shared/components/modals/generic-modal/generic-modal.module';
import { LoanOpsProvider } from '../../../../providers/loan-ops/loan-ops';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';
import { NewPipesModule } from '@app/shared/pipes/new-pipes.module';
import { NewDirectivesModule } from '@app/shared/directives/new-directives.module';
import {FlowHeaderComponentModule} from '@app/shared/components/flow/flow-header/flow-header.module';

@NgModule({
  declarations: [
    AmountSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(AmountSelectPage),
    ComponentsModule,
    DirectivesModule,
    PaymentsModule,
    BdbUtilsModule,
    GenericModalModule,
    TransactionResultTrasfersModule,
    NewPipesModule,
    NewDirectivesModule,
    FlowHeaderComponentModule,
  ],
  providers: [
    LoanOpsProvider,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AmmountSelectPageModule {}

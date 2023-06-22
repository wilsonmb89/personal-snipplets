import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditCardAmountSelectPage } from './credit-card-amount-select';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { LoanOpsProvider } from '../../../../providers/loan-ops/loan-ops';
import { CreditCardOpsProvider } from '../../../../providers/credit-card-ops/credit-card-ops';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';
import {NewPipesModule} from '@app/shared/pipes/new-pipes.module';
import {NewDirectivesModule} from '@app/shared/directives/new-directives.module';

@NgModule({
  declarations: [
    CreditCardAmountSelectPage
  ],
  providers: [
    LoanOpsProvider,
    CreditCardOpsProvider
  ],
  imports: [
    IonicPageModule.forChild(CreditCardAmountSelectPage),
    ComponentsModule,
    DirectivesModule,
    TransactionResultTrasfersModule,
    NewPipesModule,
    NewDirectivesModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreditCardAmountSelectPageModule {}

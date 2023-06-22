import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnrolledAmountCreditCardPage } from './enrolled-amount-credit-card';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import {GenericModalModule} from '@app/shared/components/modals/generic-modal/generic-modal.module';
import { CreditCardOpsProvider } from '../../../../providers/credit-card-ops/credit-card-ops';
import { LoanOpsProvider } from '../../../../providers/loan-ops/loan-ops';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';

@NgModule({
  declarations: [
    EnrolledAmountCreditCardPage,
  ],
  providers: [
    LoanOpsProvider,
    CreditCardOpsProvider
  ],
  imports: [
    IonicPageModule.forChild(EnrolledAmountCreditCardPage),
    ComponentsModule,
    DirectivesModule,
    GenericModalModule,
    TransactionResultTrasfersModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EnrolledAmountCreditCardPageModule {}

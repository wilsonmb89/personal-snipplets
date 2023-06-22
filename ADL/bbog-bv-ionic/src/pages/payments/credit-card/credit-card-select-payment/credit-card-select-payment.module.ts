import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditCardSelectPaymentPage } from './credit-card-select-payment';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { GenericModalModule } from '@app/shared/components/modals/generic-modal/generic-modal.module';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';
import { LoanOpsProvider } from '../../../../providers/loan-ops/loan-ops';
import { CreditCardOpsProvider } from '../../../../providers/credit-card-ops/credit-card-ops';

@NgModule({
  declarations: [
    CreditCardSelectPaymentPage,
  ],
  providers: [
    LoanOpsProvider,
    CreditCardOpsProvider
  ],
  imports: [
    IonicPageModule.forChild(CreditCardSelectPaymentPage),
    ComponentsModule,
    DirectivesModule,
    BdbUtilsModule,
    GenericModalModule,
    TransactionResultTrasfersModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreditCardSelectPaymentPageModule {}

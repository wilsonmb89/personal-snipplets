import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {EnrolledAmountCreditsPage} from './enrolled-amount-credits';
import {ComponentsModule} from '../../../../components/components.module';
import {PaymentsModule} from '../../../../new-app/modules/payments/payments.module';
import {BdbUtilsModule} from '@app/shared/utils/bdb-utils.module';
import {GenericModalModule} from '@app/shared/components/modals/generic-modal/generic-modal.module';
import {ListCataloguesDelegateProvider} from '@app/delegate/list-parameters/list-catalogues-delegate.service';
import {DirectivesModule} from '../../../../directives/directives.module';
import { LoanOpsProvider } from '../../../../providers/loan-ops/loan-ops';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';

@NgModule({
  declarations: [
    EnrolledAmountCreditsPage,
  ],
  imports: [
    IonicPageModule.forChild(EnrolledAmountCreditsPage),
    ComponentsModule,
    PaymentsModule,
    BdbUtilsModule,
    GenericModalModule,
    DirectivesModule,
    TransactionResultTrasfersModule
  ],
  providers: [
    ListCataloguesDelegateProvider,
    LoanOpsProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EnrolledAmmountCreditsPageModule {
}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrustAgreementTransferPage } from './trust-agreement-transfer';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import {TransfersDelegateModule} from '@app/delegate/transfers-delegate/transfers-delegate.module';
import {GenericModalModule} from '@app/shared/components/modals/generic-modal/generic-modal.module';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';

@NgModule({
  declarations: [
    TrustAgreementTransferPage,
  ],
  imports: [
    IonicPageModule.forChild(TrustAgreementTransferPage),
    ComponentsModule,
    DirectivesModule,
    TransfersDelegateModule,
    GenericModalModule,
    TransactionResultTrasfersModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrustAgreementTransferPageModule {}

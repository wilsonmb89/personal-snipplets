import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DonationFromAccountPage } from './donation-from-account';
import { ComponentsModule } from '../../../../components/components.module';
import { DirectivesModule } from '../../../../directives/directives.module';
import { TransfersModule } from '@app/modules/transfers/transfer.module';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';

@NgModule({
  declarations: [
    DonationFromAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(DonationFromAccountPage),
    ComponentsModule,
    DirectivesModule,
    TransfersModule,
    TransactionResultTrasfersModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DonationFromAccountPageModule {}

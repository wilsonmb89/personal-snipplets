import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TransactionResultPage } from './transaction-result-page';
import { SendMailModalModule } from '@app/shared/components/modals/send-mail-modal/send-mail-modal.module';

@NgModule({
  declarations: [
    TransactionResultPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionResultPage),
    SendMailModalModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class TransactionResultPageModule {}

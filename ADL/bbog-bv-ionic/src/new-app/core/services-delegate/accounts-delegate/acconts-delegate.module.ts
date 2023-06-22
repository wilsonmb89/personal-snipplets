import { NgModule } from '@angular/core';

import { TransfersModule } from '@app/modules/transfers/transfer.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { AccountsDelegateService } from './accounts-delegate.service';

@NgModule({
  declarations: [],
  imports: [
    TransfersModule,
    BdbUtilsModule
  ],
  providers: [
    AccountsDelegateService
  ]
})
export class AccountsDelegateModule {}

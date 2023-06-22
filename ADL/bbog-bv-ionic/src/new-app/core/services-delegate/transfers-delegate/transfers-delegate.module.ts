import { NgModule } from '@angular/core';

import { TransfersDelegateService } from './transfers-delegate.service';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import {TransferApisModule} from '@app/apis/transfer/transfer-apis.module';

@NgModule({
  declarations: [],
  imports: [
    TransferApisModule,
    BdbUtilsModule
  ],
  providers: [
    TransfersDelegateService
  ]
})
export class TransfersDelegateModule {
}

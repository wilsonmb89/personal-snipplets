import { NgModule } from '@angular/core';
import { BdbHttpModule } from '../../http/bdb-http.module';
import { TransferCoreService } from './transfer-core/transfer-core.service';
import { TransferAccountService } from '../transfer-account/transfer-account.service';


@NgModule({
  declarations: [],
  imports: [BdbHttpModule],
  providers: [
    TransferCoreService,
    TransferAccountService
  ]
})
export class TransferApisModule {}

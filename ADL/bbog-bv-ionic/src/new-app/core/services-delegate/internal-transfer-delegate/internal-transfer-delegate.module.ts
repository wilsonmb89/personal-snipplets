import { NgModule } from '@angular/core';

import { CreditCardAdvanceDelegateService } from './credit-card-advance-delegate.service';
import { InternalTransferService } from '../../services-apis/internal-transfer/internal-transfer.service';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { TimeoutProvider } from '../../../../providers/timeout/timeout';
import { TransactionResultTrasfersModule } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-transfers.module';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    CreditCardAdvanceDelegateService,
    InternalTransferService,
    BdbUtilsProvider,
    TimeoutProvider,
    TransactionResultTrasfersModule
  ]
})
export class InternalTransferDelegateModule {}

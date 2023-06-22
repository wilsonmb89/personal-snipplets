import { NgModule } from '@angular/core';

import { BdbMaskProvider } from '../../../../../../providers/bdb-mask/bdb-mask';
import { TransactionResultHandleErrorService } from '../transaction-result-handle-error.service';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { TrxResultHistoryService } from './transaction-result-history.service';

@NgModule({
  providers: [
    TransactionResultMainService,
    TransactionResultHandleErrorService,
    TrxResultHistoryService,
    BdbMaskProvider
  ]
})
export class TransactionResultHistoryModule {}

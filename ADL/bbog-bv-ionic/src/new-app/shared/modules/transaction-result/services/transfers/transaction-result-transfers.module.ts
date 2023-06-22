import { NgModule } from '@angular/core';

import { BdbMaskProvider } from '../../../../../../providers/bdb-mask/bdb-mask';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { TrxResultTransferAcctService } from './transaction-result-accounts.service';
import { TrxResultCashAdvanceService } from './transaction-result-advance.service';
import { TrxResultFiduciaryService } from './transaction-result-fiduciary.service';
import { TrxResultDonationsService } from './transaction-result-donations.service';
import { TrxResultLoanService } from './transaction-result-loan.service';
import { TrxResultTransferPocketService } from './transaction-result-pockets.service';
import { TransactionResultHandleErrorService } from '../transaction-result-handle-error.service';

@NgModule({
  providers: [
    TransactionResultMainService,
    TransactionResultHandleErrorService,
    TrxResultTransferAcctService,
    TrxResultCashAdvanceService,
    TrxResultFiduciaryService,
    TrxResultDonationsService,
    TrxResultLoanService,
    TrxResultTransferPocketService,
    BdbMaskProvider
  ]
})
export class TransactionResultTrasfersModule {}

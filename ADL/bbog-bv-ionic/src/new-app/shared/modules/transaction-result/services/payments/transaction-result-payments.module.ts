import { NgModule } from '@angular/core';

import { BdbMaskProvider } from '../../../../../../providers/bdb-mask/bdb-mask';
import { TransactionResultHandleErrorService } from '../transaction-result-handle-error.service';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { TrxResultBillService } from './transaction-result-bill.service';
import { TrxResultCreditService } from './transaction-result-credit.service';
import { TrxResultCreditCardService } from './transaction-result-creditcard.service';
import { TrxResultDianTaxService } from './transaction-result-dianTax.service';
import { TrxResultFacilpassService } from './transaction-result-facilpass.service';
import { TrxResultPilaService } from './transaction-result-pila.service';
import { TrxResultRechargeService } from './transaction-result-recharge.service';
import { TrxResultTaxService } from './transaction-result-tax.service';

@NgModule({
  providers: [
    BdbMaskProvider,
    TransactionResultMainService,
    TransactionResultHandleErrorService,
    TrxResultCreditCardService,
    TrxResultCreditService,
    TrxResultRechargeService,
    TrxResultBillService,
    TrxResultTaxService,
    TrxResultPilaService,
    TrxResultDianTaxService,
    TrxResultFacilpassService,
  ]
})
export class TransactionResultPaymentsModule {}

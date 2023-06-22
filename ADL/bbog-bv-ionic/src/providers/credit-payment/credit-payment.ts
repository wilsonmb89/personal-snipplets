import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProgressBarData } from '../../app/models/progress-bar';
import { ProgressBarProvider } from '../progress-bar/progress-bar';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { AccountAny } from '../../app/models/enrolled-transfer/account-any';
import { ProductDetail } from '../../app/models/products/product-model';
import { PaymentsProvider } from '../payments/payments';
import { CreditCardPaymentProvider } from '../credit-card-payment/credit-card-payment';
import { TsErrorProvider } from '../ts-error/ts-error-provider';

@Injectable()
export class CreditPaymentProvider {

  constructor(
    public http: HttpClient,
    private progressBar: ProgressBarProvider,
    private bdbMask: BdbMaskProvider,
    private paymentsProvider: PaymentsProvider,
    private creditCardPayment: CreditCardPaymentProvider,
    private tsErrorProvider: TsErrorProvider
  ) {}

  updateProgressBarCredit(progressBarData: ProgressBarData) {

    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, progressBarData.title);

    if (progressBarData.contraction != null) {
      this.progressBar.setContraction(progressBarData.contraction);
    }

    if (progressBarData.logo != null) {
      this.progressBar.setLogo(progressBarData.logo);
    }

    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [progressBarData.details]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);
  }
}

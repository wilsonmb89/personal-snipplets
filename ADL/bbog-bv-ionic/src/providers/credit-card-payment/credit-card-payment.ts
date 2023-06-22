import { Injectable } from '@angular/core';
import { ProgressBarProvider } from '../progress-bar/progress-bar';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { ProgressBarData } from '../../app/models/progress-bar';
import { MobileSummaryProvider, SummaryHeader } from '../../components/mobile-summary';

@Injectable()
export class CreditCardPaymentProvider {

  constructor(
    private progressBar: ProgressBarProvider,
    private mobileSummary: MobileSummaryProvider
  ) { }

  updateProgressBarCreditCard(progressBarData: ProgressBarData) {

    this.progressBar.resetObject();
    this.mobileSummary.reset();
    const header = new SummaryHeader();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, progressBarData.title);
    header.title = progressBarData.title;
    if (!!progressBarData.contraction) {
      this.progressBar.setContraction(progressBarData.contraction);
      header.contraction = progressBarData.contraction;
      header.hasContraction = true;
    } else {
      header.hasContraction = false;
    }

    if (!!progressBarData.logo) {
      this.progressBar.setLogo(progressBarData.logo);
      header.logoPath = progressBarData.logo;
    }

    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [progressBarData.details]);
    header.details = [progressBarData.details];
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);

    this.mobileSummary.setHeader(header);

  }

}

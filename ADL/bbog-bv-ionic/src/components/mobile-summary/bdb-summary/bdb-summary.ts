import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MobileSummary } from '../model/mobile-summary';
import { MobileSummaryProvider } from '../provider/mobile-summary';


@Component({
  selector: 'bdb-summary',
  templateUrl: 'bdb-summary.html'
})
export class BdbSummaryComponent {

  summary: MobileSummary;
  color: string;

  constructor(
    public mobileSummary: MobileSummaryProvider
  ) {
    this.summary = mobileSummary.getInstance();
    this.color = '#fdc130';
  }

}

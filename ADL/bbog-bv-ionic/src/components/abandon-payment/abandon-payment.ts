import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProgressBarProvider } from '../../providers/progress-bar/progress-bar';
import { AccessDetailProvider } from '../../providers/access-detail/access-detail';
import { MobileSummaryProvider } from '../mobile-summary';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';

@Component({
  selector: 'abandon-payment',
  templateUrl: 'abandon-payment.html'
})
export class AbandonPaymentComponent {

  @Input() text = BdbConstants.ABANDON_TRANS;
  @Output() onAbandonClicked: EventEmitter<string> = new EventEmitter();

  constructor(
    private progressBar: ProgressBarProvider,
    private accessDetail: AccessDetailProvider,
    private mobileSummary: MobileSummaryProvider
  ) {}

  onAbandonPressed() {
    // clear access anywhere key
    this.accessDetail.unselectedOrigin();
    // reset web ProgressBar
    this.progressBar.resetObject();
    // reset mobile summary
    this.mobileSummary.reset();
    // emit event
    this.onAbandonClicked.emit();
  }
}

import { Component } from '@angular/core';
import { ProgressBar } from '../../app/models/progress-bar';
import { ProgressBarProvider } from '../../providers/progress-bar/progress-bar';

@Component({
  selector: 'web-progress-bar-new',
  templateUrl: 'web-progress-bar-new.html'
})
export class WebProgressBarNewComponent {

  model: ProgressBar;

  constructor(
    private progressBarProvider: ProgressBarProvider
  ) {
    this.model = progressBarProvider.getInstance();
  }

  isDetailCostNotAvailable(detail: string): boolean {
    return detail && detail.toString().includes('NO_AVAILABLE');
  }
}


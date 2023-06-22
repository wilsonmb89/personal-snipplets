import { Component } from '@angular/core';
import { ProgressBar } from '../../app/models/progress-bar';
import { ProgressBarProvider } from '../../providers/progress-bar/progress-bar';

@Component({
  selector: 'web-progress-bar',
  templateUrl: 'web-progress-bar.html'
})
export class WebProgressBarComponent {

  model: ProgressBar;

  constructor(
    private progressBarProvider: ProgressBarProvider
  ) {
    this.model = progressBarProvider.getInstance();
  }
}


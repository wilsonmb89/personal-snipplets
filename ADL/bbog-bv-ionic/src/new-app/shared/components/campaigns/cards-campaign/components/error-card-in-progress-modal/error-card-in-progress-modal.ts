import { Component } from '@angular/core';
import { PulseModalControllerProvider } from '../../../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { App } from 'ionic-angular';

@Component({
  selector: 'app-error-card-in-progress-modal',
  templateUrl: './error-card-in-progress-modal.html'
})
export class ErrorCardInProgressModal {

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
    public app: App
  ) {
  }

  public async closeModal(): Promise<void> {
    await this.pulseModalCtrl.dismiss();
    await this.app.getActiveNav().push('DetailAndTxhistoryPage');

  }

}

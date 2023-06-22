import { Component, Input } from '@angular/core';
import { PulseModalControllerProvider } from '../../../../../../../providers/pulse-modal-controller/pulse-modal-controller';

@Component({
  selector: 'app-tyc-card-template',
  templateUrl: './tyc-card-template.html'
})
export class TycCardTemplate {

  @Input()
  tyc: string;

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider
  ) {
  }


  public async closeModal(): Promise<void> {
    await this.pulseModalCtrl.dismiss();
  }


}

import { Component } from '@angular/core';
import {PulseModalControllerProvider} from '../../../../../../providers/pulse-modal-controller/pulse-modal-controller';

@Component({
  selector: 'pocket-exceed-max',
  templateUrl: 'pocket-exceed-max.html'
})
export class PocketExceedMaxComponent {

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider
  ) { }

  async closeModal() {
    await this.pulseModalCtrl.dismiss();
  }

}

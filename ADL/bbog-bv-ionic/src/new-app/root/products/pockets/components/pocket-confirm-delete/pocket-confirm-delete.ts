import { Component } from '@angular/core';
import { PulseModalControllerProvider } from '../../../../../../providers/pulse-modal-controller/pulse-modal-controller';

@Component({
  selector: 'pocket-confirm-delete',
  templateUrl: 'pocket-confirm-delete.html'
})
export class PocketConfirmDeleteComponent {

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider
  ) { }

  async confirmDelete(confirm: boolean) {
    await this.pulseModalCtrl.dismiss({
      confirm
    });
  }

}

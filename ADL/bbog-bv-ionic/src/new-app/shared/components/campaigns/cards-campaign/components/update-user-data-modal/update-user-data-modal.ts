import { Component } from '@angular/core';
import { PulseModalControllerProvider } from '../../../../../../../providers/pulse-modal-controller/pulse-modal-controller';

@Component({
  selector: 'app-update-user-data-modal',
  templateUrl: './update-user-data-modal.html'
})
export class UpdateUserDataModalComponent {

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider
  ) {
  }


  public async closeModal(state: string): Promise<void> {
    await this.pulseModalCtrl.dismiss({state});
  }

}

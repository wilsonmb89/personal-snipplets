import { Component } from '@angular/core';
import { PulseModalControllerProvider } from '../../../../../../providers/pulse-modal-controller/pulse-modal-controller';

@Component({
  selector: 'campaign-dash-unicef',
  templateUrl: 'campaign-dash-unicef.html'
})
export class CampaignDashUnicefComponent {

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider
  ) { }

  async closeModal() {
    await this.pulseModalCtrl.dismiss();
  }

}

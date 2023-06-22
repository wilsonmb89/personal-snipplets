import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PulseModalControllerProvider } from '../../../../../../providers/pulse-modal-controller/pulse-modal-controller';

@Component({
  selector: 'million-banquet-modal',
  templateUrl: 'million-banquet-modal.html'
})
export class CampaignMillionBanquetComponent {

  private readonly CONST_MILLION_BANQUET_URL = 'https://www.banquetedelmillon.org';

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider
  ) { }

  public async closeModal(): Promise<void> {
    await this.pulseModalCtrl.dismiss();
  }

  public async goToDonations(): Promise<void> {
    await this.pulseModalCtrl.dismiss({ goToDonations: true });
  }

  public openExternalUrl(): void {
    window.open(this.CONST_MILLION_BANQUET_URL, '_blank');
  }

}

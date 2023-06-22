import { Component, OnInit } from '@angular/core';
import { PulseModalControllerProvider } from '../../../../../providers/pulse-modal-controller/pulse-modal-controller';

@Component({
  selector: 'app-contact-numbers-modal',
  templateUrl: './contact-numbers-modal.html'
})
export class ContactNumbersModalComponent implements OnInit {

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
  ) { }

  ngOnInit() {
  }

  public async closeModal(): Promise<void> {
    await this.pulseModalCtrl.dismiss();
  }

}

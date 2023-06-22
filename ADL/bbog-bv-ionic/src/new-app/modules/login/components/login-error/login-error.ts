import { Component, Input } from '@angular/core';
import { PulseModalControllerProvider } from '../../../../../providers/pulse-modal-controller/pulse-modal-controller';

@Component({
  selector: 'login-error',
  templateUrl: 'login-error.html'
})
export class LoginErrorComponent {

  @Input() set description(description: string) {
    this.getDescription = description || 'Por favor verifica tus datos <br> e intenta nuevamente.';
  }

  getDescription: string;

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider
  ) { }

  async closeModal() {
    await this.pulseModalCtrl.dismiss();
  }

}

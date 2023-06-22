import { Component, Input, OnInit } from '@angular/core';

import { PulseModalControllerProvider } from '../../../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { ErrorModalModel } from '../../model/errorModal.model';

@Component({
  selector: 'error-modal',
  templateUrl: './error-modal.html'
})
export class ErrorModalComponent implements OnInit {

  @Input() errorModalModel: ErrorModalModel;

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider
  ) { }

  ngOnInit(): void {
    if (!this.errorModalModel) {
      this.closeModal();
    }
  }

  private async closeModal(): Promise<void> {
    await this.pulseModalCtrl.dismiss();
  }

  public onCloseClicked(): void {
    if (this.errorModalModel.callToActionInClose) {
      this.errorModalModel.callToAction();
    }
    this.closeModal();
  }

  public onActionClicked(): void {
    this.errorModalModel.callToAction();
    this.closeModal();
  }

}

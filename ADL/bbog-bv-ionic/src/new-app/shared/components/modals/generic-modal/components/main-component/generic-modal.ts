import { Component, OnInit, Input } from '@angular/core';

import { PulseModalControllerProvider } from '../../../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { GenericModalModel } from '../../model/generic-modal.model';
import { boxAnimation } from '../../../../../../../components/core/utils/animations/transitions';


@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.html',
  animations: [boxAnimation]
})
export class GenericModalComponent implements OnInit {

  @Input() genericModalData: GenericModalModel;

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider
  ) { }

  ngOnInit() {
  }

  public async closeModal(): Promise<void> {
    if (!!this.genericModalData.mainActionInClose
      && !!this.genericModalData.actionButtons && this.genericModalData.actionButtons.length > 0) {
        this.genericModalData.actionButtons[0].action();
    }
    await this.pulseModalCtrl.dismiss();
  }

  public async executeAction(callbackFunction: Function): Promise<void> {
    await callbackFunction();
    this.closeModal();
  }

}

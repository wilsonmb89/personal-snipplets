import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

import { PulseModalControllerProvider } from '../../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { GenericModalModel } from '../model/generic-modal.model';
import { GenericModalComponent } from '../components/main-component/generic-modal';

@Injectable()
export class GenericModalService {

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
  ) {}

  public async launchGenericModal (
    viewRef: ViewContainerRef,
    resolver: ComponentFactoryResolver,
    modalData: GenericModalModel
  ): Promise<void> {
    const modal = await this.pulseModalCtrl.create({
      component: GenericModalComponent,
      componentProps: {
        genericModalData: modalData
      }
    }, viewRef, resolver);
    await modal.present();
  }

}

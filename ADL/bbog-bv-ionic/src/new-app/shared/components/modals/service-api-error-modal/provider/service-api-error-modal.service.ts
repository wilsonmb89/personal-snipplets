import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { CustomerErrorMessage } from '@app/shared/models/api-gateway/api-gateway-error.model';

import { PulseModalControllerProvider } from '../../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { ErrorModalComponent } from '../components/error-modal/error-modal';
import { ErrorModalModel } from '../model/errorModal.model';

@Injectable()
export class ServiceApiErrorModalService {

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
  ) { }

  public async launchErrorModal(
    viewRef: ViewContainerRef,
    resolver: ComponentFactoryResolver,
    customerErrorMessage?: CustomerErrorMessage,
    customPathIcon?: string,
    callToActionInClose?: boolean,
    customCallToAction?: () => void
  ): Promise<void> {
    const modalData = this.buildErrorModel(
      customerErrorMessage,
      customPathIcon,
      callToActionInClose,
      customCallToAction
    );
    const modal = await this.pulseModalCtrl.create({
      component: ErrorModalComponent,
      componentProps: {
        errorModalModel: modalData
      }
    }, viewRef, resolver);
    await modal.present();
  }

  private buildErrorModel(
    customerErrorMessage?: CustomerErrorMessage,
    customPathIcon?: string,
    callToActionInClose?: boolean,
    customCallToAction?: () => void
  ): ErrorModalModel {
    const defaultIconPath = 'assets/imgs/shared/error-modal/alert-icon.svg';
    const defaultCallToAction = () => { };
    if (!customerErrorMessage) {
      return {
        iconPath: defaultIconPath,
        customerErrorMessage: {
          title: 'Algo ha ocurrido.',
          message: 'En este momento la operación no se pudo realizar. Por favor intenta más tarde.',
          alertType: '',
          actions: null
        },
        callToActionInClose: false,
        callToAction: defaultCallToAction
      };
    } else {
      return {
        iconPath: !!customPathIcon ? customPathIcon : defaultIconPath,
        customerErrorMessage: customerErrorMessage,
        callToActionInClose: !!callToActionInClose,
        callToAction: !!customCallToAction ? customCallToAction : defaultCallToAction
      };
    }
  }

}

import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';

import { TransactionResultModel } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { PulseModalControllerProvider } from '../../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { SendMailModalComponent } from '../components/main-component/send-mail-modal';

@Injectable()
export class SendMailModalService {

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
  ) {}

  public async launchSendMailModal (
    viewRef: ViewContainerRef,
    resolver: ComponentFactoryResolver,
    transactionData: TransactionResultModel
  ): Promise<void> {
    const modal = await this.pulseModalCtrl.create({
      component: SendMailModalComponent,
      componentProps: {
        transactionData: transactionData
      }
    }, viewRef, resolver);
    await modal.present();
  }
}

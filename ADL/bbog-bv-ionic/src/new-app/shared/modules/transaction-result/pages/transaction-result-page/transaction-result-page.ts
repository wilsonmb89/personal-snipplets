import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SendMailModalService } from '@app/shared/components/modals/send-mail-modal/services/send-mail-modal.service';
import { TransactionResultModel } from '../../models/transaction-result.model';

@IonicPage({
  name: 'transaction%result%page',
  segment: 'transaction-result-page'
})
@Component({
  selector: 'transaction-result-page',
  templateUrl: './transaction-result-page.html'
})
export class TransactionResultPage implements OnInit {

  transactionData: TransactionResultModel;

  constructor(
    public navParams: NavParams,
    private navCtrl: NavController,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private sendMailModalService: SendMailModalService
  ) {
    this.transactionData = navParams.get('transactionData');
    if (!this.transactionData) {
      this.navCtrl.setRoot('DashboardPage');
    }
  }

  ngOnInit(): void {}

  public doMailAction(): void {
    if (!!this.transactionData.controls
        && !!this.transactionData.controls.controlEmail
        && !this.transactionData.controls.controlEmail.hidden) {
      this.sendMailModalService.launchSendMailModal(this.viewRef, this.resolver, this.transactionData);
    }
  }

  public doMainAction(): void {
    if (!!this.transactionData.controls
        && !!this.transactionData.controls.controlMainButton
        && !!this.transactionData.controls.controlMainButton.action) {
      this.transactionData.controls.controlMainButton.action();
    }
  }

  public doSecondaryAction(): void {
    if (!!this.transactionData.controls
        && !!this.transactionData.controls.controlSecondaryButton
        && !!this.transactionData.controls.controlSecondaryButton.action) {
      this.transactionData.controls.controlSecondaryButton.action();
    }
  }
}

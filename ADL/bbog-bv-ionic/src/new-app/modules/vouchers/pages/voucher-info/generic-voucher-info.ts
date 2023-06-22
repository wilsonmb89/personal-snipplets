import {Component, Input, Output, EventEmitter} from '@angular/core';
import {VoucherButton, VoucherData} from '../../../../../app/models/voucher/voucher-data';
import {NavController} from 'ionic-angular';
import {NavigationProvider} from '../../../../../providers/navigation/navigation';


@Component({
  selector: 'generic-voucher-info',
  templateUrl: 'generic-voucher-info.html'
})
export class GenericVoucherInfoComponent {

  @Input() data: VoucherData;
  @Input() buttons: Array<VoucherButton>;
  @Input() viewSendEmail: boolean;
  @Output() triggerSendEmail = new EventEmitter<any>();
  @Output() submitSendEmail = new EventEmitter<string>();
  @Output() popFlowEvent = new EventEmitter<string>();
  @Output() btnClick = new EventEmitter<string>();
  today: number = Date.now();

  constructor(
  private navCtrl: NavController,
  public navigation: NavigationProvider,
  ) {
  }

  private triggerSendEmailEvent(): void {
    this.triggerSendEmail.emit();
  }

  private submitSendEmailEvent(e: any): void {
    this.submitSendEmail.emit(e);
  }

  popFlow() {
    this.popFlowEvent.emit();
  }

  onClick(page: string) {
    this.navCtrl.setRoot(page);
  }

  public goPreviousPage(): void {
    this.navigation.onBackPressed(this.navCtrl);
  }

}

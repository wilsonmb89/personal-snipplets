import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VoucherData, VoucherButton } from '../../app/models/voucher/voucher-data';

@Component({
  selector: 'voucher-info',
  templateUrl: 'voucher-info.html'
})
export class VoucherInfoComponent {

  @Input() data: VoucherData;
  @Input() buttons: Array<VoucherButton>;
  @Input() viewSendEmail: boolean;
  @Output() triggerSendEmail = new EventEmitter<any>();
  @Output() submitSendEmail = new EventEmitter<string>();
  @Output() popFlowEvent = new EventEmitter<string>();
  @Output() btnClick = new EventEmitter<string>();
  today: number = Date.now();

  constructor() {
  }

  triggerSendEmailEvent() {
    this.triggerSendEmail.emit();
  }

  submitSendEmailEvent(e: any) {
    this.submitSendEmail.emit(e);
  }

  popFlow() {
    this.popFlowEvent.emit();
  }

  onBtnClick(button) {
    this.btnClick.emit(button);
  }

  isDetailCostNotAvailable(detail: string): boolean {
    return detail && detail.includes('NO_AVAILABLE');
  }

}

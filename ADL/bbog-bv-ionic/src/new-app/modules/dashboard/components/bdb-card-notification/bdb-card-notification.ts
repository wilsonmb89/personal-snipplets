import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardNotification } from '../../../../../app/models/card-notification';

@Component({
  selector: 'bdb-card-notification-new',
  templateUrl: 'bdb-card-notification.html'
})
export class BdbCardNotificationNewComponent {

  @Input() cardNotification: CardNotification;
  @Input() whithCloseBtn: boolean;
  @Output() clickCard = new EventEmitter();
  @Output() clickClose = new EventEmitter<boolean>();

  constructor() {}

  public executeEmit(): void {
    this.clickCard.emit();
  }

  public close(): void {
    this.clickClose.emit();
  }
}

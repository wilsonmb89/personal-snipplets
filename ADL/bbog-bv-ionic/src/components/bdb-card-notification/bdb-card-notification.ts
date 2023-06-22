import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CardNotification } from '../../app/models/card-notification';

@Component({
  selector: 'bdb-card-notification',
  templateUrl: 'bdb-card-notification.html'
})
export class BdbCardNotificationComponent {

  @Input() cardNotification: CardNotification;
  @Output() clickCard = new EventEmitter();
  @Output() clickClose = new EventEmitter();

  constructor() {
  }

  executeEmit() {
    this.clickCard.emit();
  }

  close() {
    this.clickClose.emit();
  }

}

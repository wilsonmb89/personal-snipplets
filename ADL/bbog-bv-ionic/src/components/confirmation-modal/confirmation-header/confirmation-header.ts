import { Component, Input } from '@angular/core';

@Component({
  selector: 'confirmation-header',
  template:
    `<div class="conf__wrapper">
      <div class="conf__wrapper__conf-icon">
        <img [src]="iconPath">
      </div>
      <div class="conf__wrapper__title">{{title}}</div>
      <div class="conf__wrapper__authnum"><strong>No. de autorización:</strong> {{authNum}}</div>
      <div class="conf__wrapper__date">{{dateTime}}</div>
    </div>
    `
})
export class ConfirmationHeaderComponent {

  @Input() iconPath = 'assets/imgs/green_check.svg';
  @Input() title: string;
  @Input() authNum: string;
  @Input() dateTime: string;

  constructor() {
  }

}

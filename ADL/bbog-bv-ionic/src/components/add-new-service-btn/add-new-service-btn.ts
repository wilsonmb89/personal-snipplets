import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'add-new-service-btn',
  template:
    `
  <div class="wrapper">
    <div (click)="enrollClicked()" class="wrapper__item-btn">
      <div class="wrapper__item-btn__avatar">
        <div class="wrapper__item-btn__avatar__inner"></div>
        <div class="wrapper__item-btn__avatar__add"><img src="assets/imgs/yellow-cross.svg"></div>
      </div>
      <div>
        <p class="wrapper__item-btn__item-detail">{{btnText}}</p>
      </div>
    </div>
  </div>
  `
})
export class AddNewServiceBtnComponent {

  @Input() btnText: string;
  @Output() onEnrollClicked: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  enrollClicked() {
    this.onEnrollClicked.emit();
  }
}


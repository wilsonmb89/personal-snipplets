import { Component, Input } from '@angular/core';

@Component({
  selector: 'confirmation-detail',
  template:
  `<div class="conf-detail-wrapper">
    <div class="conf-detail-wrapper__title">
      {{title}}
    </div>
    <div class="conf-detail-wrapper__desc">
      {{desc}}
    </div>
  </div>
  `
})
export class ConfirmationDetailComponent {

  @Input() title: string;
  @Input() desc: string;

  constructor() {
  }
}

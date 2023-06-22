import { Component, Input } from '@angular/core';

@Component({
  selector: 'confirmation-sub-header',
  template:
  `<div class="conf-sub-wrapper">
    <div class="conf-sub-wrapper__sub">{{sub}}</div>
    <div class="conf-sub-wrapper__desc" *ngFor="let des of desc">{{des}}</div>
  </div>
  `
})
export class ConfirmationSubHeaderComponent {

  @Input() sub: string;
  @Input() desc: Array<string> = [];
  constructor() {
  }

}

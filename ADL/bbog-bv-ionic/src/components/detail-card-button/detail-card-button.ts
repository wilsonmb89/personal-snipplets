import { Component, Input } from '@angular/core';

@Component({
  selector: 'detail-card-button',
  templateUrl: 'detail-card-button.html'
})
export class DetailCardButtonComponent {

  @Input() callback: Function;
  @Input() buttonLabel: string;
  @Input() mobile: string;

  constructor() { }

}

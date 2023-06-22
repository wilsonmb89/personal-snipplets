import { Component, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'tu-plus-card',
  templateUrl: 'tu-plus-card.html',
  animations: [
    trigger('upAndDown', [
      state('true', style({
        'height': '24px',
      })),
      state('false', style({
      })),
      transition('true => false', [
        animate('200ms')
      ]),
      transition('false => true', [
        animate('200ms')
      ]),
    ])
  ]
})
export class TuPlusCardComponent {

  @Input() points = '';
  @Input() showLoader = false;
  @Input() privateMode = false;
  @Input() error: boolean;

  errorMessage = 'Sin información';

  constructor() { }

}

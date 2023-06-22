import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'bdb-arrow-animate',
  templateUrl: 'bdb-arrow-animate.html'
})
export class BdbArrowAnimateComponent {

  @Input() active = false;
  @Output() clickArrow = new EventEmitter();

  constructor() {
  }

  eventClick() {
    this.clickArrow.emit('');
  }

}

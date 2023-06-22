import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-icon-arrow',
  templateUrl: 'svg-icon-arrow.html'
})
export class SvgIconArrowComponent {

  @Input()
  color = '#6680AD';
  @Input()
  opacity = '.4';
  @Input()
  invest = false;

  constructor() {
  }

}

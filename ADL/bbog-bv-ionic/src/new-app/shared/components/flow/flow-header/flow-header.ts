import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'flow-header',
  templateUrl: 'flow-header.html'
})
export class FlowHeaderComponent {

  @Input() rightOption = 'logout';
  @Input() showStart = true;
  @Input() showEnd = true;
  @Output() onStart = new EventEmitter();
  @Output() onEnd = new EventEmitter();

  constructor() { }

  onClickStart(): void {
    this.onStart.emit();
  }

  onClickEnd(): void {
    this.onEnd.emit();
  }

}

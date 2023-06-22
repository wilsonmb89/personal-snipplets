import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'bdb-button',
  templateUrl: 'bdb-button.html'
})
export class BdbButtonComponent {

  @Input() text: string;
  @Output() clickBtn: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  executeEmit() {
    this.clickBtn.emit();
  }

}

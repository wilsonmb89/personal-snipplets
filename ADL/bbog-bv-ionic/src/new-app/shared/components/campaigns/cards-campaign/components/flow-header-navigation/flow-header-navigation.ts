import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'flow-header-navigation',
  templateUrl: 'flow-header-navigation.html'
})
export class FlowHeaderNavigationComponent {

  @Output() onLeftClicked = new EventEmitter();

  constructor() { }

  leftClicked(): void {
    this.onLeftClicked.emit();
  }

}

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'login-token-locked',
  templateUrl: 'login-token-locked.html'
})
export class LoginTokenLockedComponent {

  @Output() closeStep = new EventEmitter();

  constructor() { }

  onCloseStep(): void {
    this.closeStep.emit();
  }

}

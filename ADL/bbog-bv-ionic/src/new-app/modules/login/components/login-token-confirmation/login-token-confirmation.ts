import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'login-token-confirmation',
  templateUrl: 'login-token-confirmation.html'
})
export class LoginTokenConfirmationComponent {

  @Output() closeStep = new EventEmitter();
  @Output() submit = new EventEmitter();
  @Input() numberSafeSite = '------';

  constructor() { }

  onCloseStep(): void {
    this.closeStep.emit();
  }

  onSubmit(): void {
    this.submit.emit();
  }

}

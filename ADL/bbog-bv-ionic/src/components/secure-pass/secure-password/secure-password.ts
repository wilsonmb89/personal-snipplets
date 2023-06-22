import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'secure-password',
  templateUrl: 'secure-password.html'
})
export class SecurePasswordComponent {

  @Input() titleNormal: '';
  @Input() titleBold: '';
  @Input() celular: '';
  @Output() submitEvent = new EventEmitter();
  @Output() cancelEvent = new EventEmitter();
  formSecure: FormGroup;
  error = false;

  constructor(private formBuilder: FormBuilder) {
    this.buildformSecure();
  }

  private buildformSecure() {
    this.formSecure = this.formBuilder.group(
      {
        code: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
        pin: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
        confirmPin: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])]
      }, {validator: this.matchingPasswords('pin', 'confirmPin')});
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        this.error = true;
        return {
          mismatchedPasswords: true
        };
      } else {
        this.error = false;
      }
    };
  }

  public cancel() {
    this.cancelEvent.emit();
  }

  public submit() {
    const data = {
      'code': this.formSecure.value.code,
      'pin': this.formSecure.value.pin
    };

    this.submitEvent.emit(data);
    this.formSecure.patchValue({ code: '', pin: '', confirmPin: ''});
  }
}

import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'bdb-generic-input',
  templateUrl: 'bdb-generic-input.html'
})
export class BdbGenericInputComponent {

  @Input() inputHeader: string;
  @Input() inputPlaceholder: string;
  @Input() inputDisabled: boolean;
  @Input() inputForm: FormGroup;
  @Output() onVerifyChange = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.inputForm = this.formBuilder.group({
      creditNumber: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{16}')])],
    });

  }

  onKeyup() {
    this.onVerifyChange.emit();
  }

}

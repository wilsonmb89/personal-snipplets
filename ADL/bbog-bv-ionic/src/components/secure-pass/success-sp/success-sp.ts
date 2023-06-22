import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'success-sp',
  templateUrl: 'success-sp.html'
})
export class SuccessSpComponent {

  @Input() titleNormal: '';
  @Input() titleBold: '';
  @Output() submitEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
  }

  public submit() {
    this.submitEvent.emit();
  }

}

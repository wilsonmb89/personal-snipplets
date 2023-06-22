import { Component, Output, EventEmitter, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { boxAnimation } from '../../../../../components/core/utils/animations/transitions';

@Component({
  selector: 'login-token',
  templateUrl: 'login-token.html',
  animations: [boxAnimation]
})
export class LoginTokenComponent implements OnInit {

  _isError = false;
  @Input() set isError(isError: boolean) {
    this._isError = isError;
    this.tokenForm.controls.token.setValue('');
  }
  @Output() closeStep = new EventEmitter();
  @Output() submitToken = new EventEmitter<string>();
  @ViewChild('inputToken', { read: ElementRef }) inputToken: ElementRef;
  tokenForm = new FormGroup({
    token: new FormControl('', [
      Validators.required,
      Validators.maxLength(6),
      Validators.minLength(6)
    ])
  });

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      const elPulseInput = this.inputToken.nativeElement as HTMLElement;
      if (!!elPulseInput && elPulseInput.getElementsByTagName('input').length > 0) {
        const input = elPulseInput.getElementsByTagName('input')[0];
        input.addEventListener('mousewheel', function () {
          this.blur();
        });
        input.focus();
      }
    }, 250);
  }

  onCloseStep(): void {
    this.closeStep.emit();
  }

  submitInput(): void {
    if (this.tokenForm.invalid) {
      return;
    }

    this.submitToken.emit(this.tokenForm.controls.token.value);
  }

}

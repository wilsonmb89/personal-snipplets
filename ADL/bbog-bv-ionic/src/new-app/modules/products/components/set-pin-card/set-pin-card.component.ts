import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import { CreditCardService } from '../../services/credit-card.service';

@Component({
  selector: 'set-pin-card',
  templateUrl: './set-pin-card.component.html'
})
export class SetPinCardComponent implements OnInit {

  @Input() textDescription: string;
  @Input() inputLabelKey: string;
  @Input() inputLabelConfirm: string;
  @Input() btnText: string;
  @Input() btnPosition = 'center';
  @Output() key = new EventEmitter<string>();

  keyForm: FormGroup;

  keyValidation = {
    labelerror: '',
    validationError: false,
  };

  keyConfirmValidation = {
    labelerror: '',
    validationError: false,
  };

  typeInputKey = 'password';
  typeIconKey = 'view-1';
  validateKeyAccess = false;
  typeInputKeyConfirm = 'password';
  typeIconKeyConfirm = 'view-1';
  validateKeyConfirmAccess = false;

  EQUAL_MESSAGE = 'Los números no pueden ser iguales';
  CONSECUTIVE_MESSAGE = 'La clave tiene números consecutivos';
  REQUIRED_MESSAGE = 'La clave debe tener cuatro números';
  NOT_MATCH_MESSAGE = 'La clave no coincide';

  constructor(
    private creditCardService: CreditCardService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.keyForm = this.formBuilder.group({
      key: ['', [Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')]],
      keyConfirm: ['', [Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')]]
    });
  }

  get keyField(): AbstractControl | null {
    return this.keyForm.get('key');
  }

  get keyConfirmField(): AbstractControl | null {
    return this.keyForm.get('keyConfirm');
  }

  public onInputKey(event): void {
    this.eventInput(event, this.keyField, this.validateKeyAccess, this.keyValidation);
  }

  public onInputKeyConfirm(event): void {
    this.eventInput(event, this.keyConfirmField, this.validateKeyConfirmAccess, this.keyConfirmValidation, true);
  }

  public eventInput(
    event: any,
    inputKey: AbstractControl | null,
    inputAccess: boolean,
    inputValidation: any,
    secondInput: boolean = false
  ): void {
    const originalNumber = event.target.value;
    const finalValue = originalNumber.replace(/\D/g, '');
    inputKey.setValue(finalValue);
    const KeyArray = Array.from(inputKey.value);
    const validate = this.validateForm(KeyArray);
    if (secondInput) {
      this.keyConfirmField.markAsTouched();
    }
    if (validate) {
      inputValidation.validationError = validate.isError;
      inputValidation.labelerror = validate.messageError;
      inputAccess = validate.access;
    }
  }

  public validateForm(key: any[]): any {
    let messageError = '';
    if (this.creditCardService.correctLength(key)) {
      if (this.creditCardService.checkEqualKey(key)) {
        messageError = this.EQUAL_MESSAGE;
      } else if (this.creditCardService.checkConsecutiveKey(key)) {
        messageError = this.CONSECUTIVE_MESSAGE;
      } else {
        this.matchValues();
        return;
      }
    } else {
      messageError = this.REQUIRED_MESSAGE;
    }
    return {
      access: false,
      messageError,
      isError: true
    };
  }

  private matchValues(): void {
    this.keyValidation.labelerror = '';
    this.keyValidation.validationError = false;
    this.keyConfirmValidation.labelerror = '';
    this.keyConfirmValidation.validationError = false;
    if (this.keyConfirmField.touched) {
      if (!this.creditCardService.IsEqualKey(this.keyField.value, this.keyConfirmField.value)) {
        this.validateKeyAccess = false;
        this.keyValidation.validationError = true;
        this.keyValidation.labelerror = this.NOT_MATCH_MESSAGE;
        this.validateKeyConfirmAccess = false;
        this.keyConfirmValidation.validationError = true;
        this.keyConfirmValidation.labelerror = this.NOT_MATCH_MESSAGE;
      } else {
        this.validateKeyAccess = true;
        this.validateKeyConfirmAccess = true;
      }
    }
  }

  public showKeyPassword(): void {
    const { inputType, inputIcon } = this.changeTypeInput(this.typeInputKey, this.typeIconKey);
    this.typeInputKey = inputType;
    this.typeIconKey = inputIcon;
  }

  public showKeyConfirmPassword(): void {
    const { inputType, inputIcon } = this.changeTypeInput(this.typeInputKeyConfirm, this.typeIconKeyConfirm);
    this.typeInputKeyConfirm = inputType;
    this.typeIconKeyConfirm = inputIcon;
  }

  public changeTypeInput(inputType: string, inputIcon: string): any {
    inputType = inputType === 'password' ? 'tel' : 'password';
    inputIcon = inputIcon === 'view-1' ? 'view-off' : 'view-1';
    return { inputType, inputIcon };
  }

  public setPin(): void {
    this.key.emit(this.keyField.value);
  }

  public disableCreditData(): boolean {
    return this.keyField.errors !== null || this.keyConfirmField.errors !== null
      || !this.validateKeyAccess || !this.validateKeyConfirmAccess;
  }

}

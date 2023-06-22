import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { boxAnimation } from '../../../../../components/core/utils/animations/transitions';
import { LoginData } from '../../../../../app/models/login-data';
import { IdentificationTypeListProvider } from '../../../../../providers/identification-type-list-service/identification-type-list-service';
export enum LoginOptionsEnum {
  SECURE_PASS,
  DEBIT_CARD
}

@Component({
  selector: 'login-form',
  templateUrl: 'login-form.html',
  animations: [boxAnimation]
})
export class LoginFormComponent implements OnInit {

  @Output() submitLogin = new EventEmitter<LoginData>();
  @ViewChild('inputDocumentNumber', { read: ElementRef }) inputDocumentNumber: ElementRef;
  @ViewChild('inputLastDigit', { read: ElementRef }) inputLastDigit: ElementRef;
  formLogin: FormGroup = new FormGroup({
    documentType: new FormControl('CC', [Validators.required]),
    documentNumber: new FormControl('', [Validators.required]),
    securePass: new FormControl('', [Validators.required]),
    debitCard: new FormGroup({
      password: new FormControl('', [Validators.required]),
      lastDigit: new FormControl('', [Validators.required]),
    })
  });
  loginOptions = LoginOptionsEnum;
  loginType = this.loginOptions.SECURE_PASS;
  listDocumentType: any[];

  constructor(
    private identificationTypeList: IdentificationTypeListProvider
  ) { }

  ngOnInit(): void {
    this.listDocumentType = this.identificationTypeList.getListWithShort();
    setTimeout(() => {
      this.removeMousewheel(this.inputDocumentNumber.nativeElement);
    }, 250);
  }

  private removeMousewheel(el: HTMLElement): void {
    if (!!el && el.getElementsByTagName('input').length > 0) {
      const input = el.getElementsByTagName('input')[0];
      input.addEventListener('mousewheel', function () {
        this.blur();
      });
    }
  }

  changeTypeLogin(type: LoginOptionsEnum): void {
    this.loginType = type;
    if (this.loginOptions.DEBIT_CARD === type) {
      setTimeout(() => {
        this.removeMousewheel(this.inputLastDigit.nativeElement);
      }, 250);
    }
  }

  changeDropDown(value: string): void {
    this.formLogin.controls.documentType.setValue(value);
  }

  onkeyBoardInput(key: string): void {
    if (key === 'Enter') {
      this.onSubmitFormLogin();
    }
  }

  onSubmitFormLogin(): void {

    if (this.formLogin.controls.documentNumber.invalid ||
      this.formLogin.controls.documentType.invalid) {
      return;
    } else if (this.loginType === this.loginOptions.SECURE_PASS &&
      this.formLogin.controls.securePass.invalid) {
      return;
    } else if (this.loginType === this.loginOptions.DEBIT_CARD &&
      this.formLogin.controls.debitCard.invalid) {
      return;
    }

    const loginData: LoginData = new LoginData();
    loginData.type = this.loginType;
    loginData.identificationNumber = this.formLogin.controls.documentNumber.value;
    loginData.identificationType = this.formLogin.controls.documentType.value;
    const debitCard = this.formLogin.controls.debitCard as FormGroup;
    loginData.password = this.loginType === this.loginOptions.SECURE_PASS ?
      this.formLogin.controls.securePass.value : debitCard.controls.password.value;
    loginData.lastDigitDebitCard = this.loginType === this.loginOptions.SECURE_PASS ? null : debitCard.controls.lastDigit.value;

    this.submitLogin.emit(loginData);
  }

  get disableConditions(): boolean {
    return (this.loginType === this.loginOptions.SECURE_PASS && (this.formLogin.controls.documentNumber.invalid ||
      this.formLogin.controls.documentType.invalid)) ||
      (this.loginType === this.loginOptions.DEBIT_CARD && (this.formLogin.controls.documentNumber.invalid ||
        this.formLogin.controls.documentType.invalid || this.formLogin.controls.debitCard.invalid));
  }

}

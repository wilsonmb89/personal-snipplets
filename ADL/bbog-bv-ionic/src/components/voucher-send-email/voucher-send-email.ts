import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'voucher-send-email',
  templateUrl: 'voucher-send-email.html',
  animations: [
    trigger('openClose', [
      state('false', style({
        opacity: 0,
        display: 'none'
      })),
      state('true', style({
        opacity: 1,
      })),
      transition('true => false', [
        animate('0.4s')
      ]),
      transition('false => true', [
        animate('0.4s')
      ]),
    ])
  ],
})
export class VoucherSendEmailComponent {

  @Input() viewSendEmail: boolean;
  @Output() triggerSendEmail = new EventEmitter<any>();
  @Output() submitSendEmail = new EventEmitter<string>();
  @ViewChild('email') emailEl: ElementRef;

  sendEmailForm: FormGroup;

  constructor() {
    this.sendEmailForm = this.createFormGroup();
  }

  animEnd(e: any) {

    if (!e.fromState) {
      this.emailEl.nativeElement.focus();
    }
  }

  closeSendEmail() {
    this.triggerSendEmail.emit();
  }

  createFormGroup() {
    return new FormGroup({
      email: new FormControl('', Validators.compose([Validators.email, Validators.required]))
    });
  }

  onSubmit() {
    this.submitSendEmail.emit(this.sendEmailForm.controls.email.value);
    this.triggerSendEmail.emit();
    this.sendEmailForm.reset();
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { PulseModalControllerProvider } from '../../../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { boxAnimation } from '../../../../../../../components/core/utils/animations/transitions';
import { CustomValidators } from '@app/shared/validators/custom-validators';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { PulseToastOptions } from '@app/shared/components/pulse-toast/model/generic-toast.model';
import { TransactionResultModel } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import {EmailNotificationDelegateService} from '../../../../../../core/services-delegate/customer-basic-data-delegate/email-notification-delegate.service';

@Component({
  selector: 'app-send-mail-modal',
  templateUrl: './send-mail-modal.html',
  animations: [boxAnimation]
})
export class SendMailModalComponent implements OnInit {

  @Input() transactionData: TransactionResultModel;

  formSendMail: FormGroup;
  inputHiddenControl: InputHiddenControl;

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
    private formBuilder: FormBuilder,
    private emailNotificationDelegateService: EmailNotificationDelegateService,
    private pulseToastService: PulseToastService,
  ) {}

  ngOnInit(): void {
    this.inputHiddenControl = { mailOptional1: true, mailOptional2: true };
    this.buildFormGroup();
  }

  private buildFormGroup(): void {
    this.formSendMail = this.formBuilder.group({
      mailPrincipal: ['', [Validators.required, CustomValidators.emailValidator]],
      mailOptional1: ['', [CustomValidators.emailValidator]],
      mailOptional2: ['', [CustomValidators.emailValidator]]
    });
  }

  public async closeModal(): Promise<void> {
    await this.pulseModalCtrl.dismiss();
  }

  public onSendMail(): void {
    if (this.formSendMail.valid) {
      this.emailNotificationDelegateService.sendEmailNotification(this.transactionData, this.buildMails())
        .subscribe(
          async () => {
            await this.pulseToastService.create(this.buildToastOptions(1));
          },
          async () => {
            await this.pulseToastService.create(this.buildToastOptions(2));
          }
        );
        this.closeModal();
    }
  }

  private buildMails(): string[] {
    const mailsTo = [];
    mailsTo.push(this.formSendMail.get('mailPrincipal').value);
    if (!!this.formSendMail.get('mailOptional1').value) {
      mailsTo.push(this.formSendMail.get('mailOptional1').value);
    }
    if (!!this.formSendMail.get('mailOptional2').value) {
      mailsTo.push(this.formSendMail.get('mailOptional2').value);
    }
    return mailsTo;
  }

  private buildToastOptions(result: ToastState): PulseToastOptions {
    const toastOptions: PulseToastOptions = {
      text: result === 1 ? 'Correos enviados con éxito.' : 'Ha ocurrido un error al enviar los correos.',
      closeable: true,
      color: result === 1 ? 'success' : 'error',
      colorvariant: '100'
    };
    return toastOptions;
  }

  public addNewEmail(): void {
    if (this.inputHiddenControl.mailOptional1) {
      this.resetFormControl('mailOptional1', [Validators.required, CustomValidators.emailValidator]);
      this.inputHiddenControl.mailOptional1 = false;
    } else if (this.inputHiddenControl.mailOptional2) {
      this.resetFormControl('mailOptional2', [Validators.required, CustomValidators.emailValidator]);
      this.inputHiddenControl.mailOptional2 = false;
    }
  }

  public closeInput(controlName: string): void {
    if (controlName === 'mailPrincipal') {
      this.formSendMail.get(controlName).reset();
    } else {
      this.resetFormControl(controlName);
      this.inputHiddenControl[controlName] = true;
    }
  }

  private resetFormControl(controlName: string, validators: ValidatorFn[] = []): void {
    this.formSendMail.get(controlName).setValidators(validators);
    this.formSendMail.get(controlName).reset();
  }

}

interface InputHiddenControl {
  mailOptional1: boolean;
  mailOptional2: boolean;
}

enum ToastState {
  success = 1,
  error
}

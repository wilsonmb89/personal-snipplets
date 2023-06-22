import { Component, OnInit, Input } from '@angular/core';
import { BdbOtpProvider } from '../../../providers/bdb-otp-provider/bdb-otp-provider';
import { PulseModalControllerProvider } from '../../../providers/pulse-modal-controller/pulse-modal-controller';
import { GetOtpReq, OtpRefType, OtpName, ValidateOtpReq } from '../../../app/models/otp-validation/otp-request';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { SimValidationRs } from '../../../app/models/sim-validation/sim-validation-rs';
import { LoadingController } from 'ionic-angular';
import { boxAnimation } from '../../../components/core/utils/animations/transitions';

const iconOtp = 'assets/imgs/token-otp/otp/otp.svg';
const iconOtpWarning = 'assets/imgs/token-otp/otp/otp-warning.svg';

@Component({
  selector: 'validate-otp',
  templateUrl: 'validate-otp.html',
  animations: [boxAnimation]
})
export class ValidateOtpComponent implements OnInit {

  @Input() userFeaturesOrigin: string;

  private stepOtp: string;
  private otpForm: FormGroup;
  private disabledActionButton: boolean;
  private otpData = {
    phoneNumber: '',
    refType: OtpRefType.REGISTRO,
    name: OtpName.LOGIN_PB,
    validationError: false,
    labelerror: '',
    opportunities: 2
  };
  private stepsDefinition = {
    send: {
      image: iconOtp,
      actionName: 'Enviar código',
      action: async () => {
        const loading = this.loadingCtrl.create();
        loading.present().then(async () => {
          this.disabledActionButton = true;
          const getOtpRes = await this.bdbOtpProvider.sendOtpUser(this.getOtpRequest())
            .catch(err => {
              loading.dismiss();
              this.disabledActionButton = false;
              this.stepOtp = 'error';
            });
          if (!!getOtpRes) {
            this.disabledActionButton = false;
            this.stepOtp = 'validate';
            loading.dismiss();
          }
        });
      }
    },
    validate: {
      image: iconOtp,
      actionName: 'Continuar',
      action: async () => {
        const loading = this.loadingCtrl.create();
        loading.present().then(async () => {
          this.disabledActionButton = true;
          this.otpData.validationError = false;
          const validateOtpRs = await this.bdbOtpProvider.validateOtpUser(this.getValidateOtpRequest())
            .catch(
              err => {
                loading.dismiss();
                this.otpForm.reset();
                this.disabledActionButton = false;
                this.stepsDefinition.validate.image = iconOtpWarning;
                if (err.status === 409) {
                  this.otpData.validationError = true;
                  if (this.otpData.opportunities === 0) {
                    this.stepOtp = 'fail';
                  }
                  this.otpData.labelerror = `Código incorrecto, te queda${this.otpData.opportunities === 1 ? '' : 'n'} ${this.otpData.opportunities} intento${this.otpData.opportunities === 1 ? '' : 's'}`;
                  this.otpData.opportunities--;
                } else {
                  this.stepOtp = 'error';
                }
              }
            );
          if (!!validateOtpRs) {
            loading.dismiss();
            this.disabledActionButton = false;
            this.closeModal(true);
          }
        });
      }
    },
    fail: {
      image: iconOtpWarning,
      actionName: 'Entendido',
      action: () => {
        this.closeModal(false);
      }
    },
    error: {
      image: iconOtpWarning,
      actionName: 'Entendido',
      action: () => {
        this.closeModal(false);
      }
    },
    wrongNumber: {
      image: '',
      actionName: 'Entendido',
      action: () => {
        this.closeModal(false);
      }
    }
  };

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
    private bdbOtpProvider: BdbOtpProvider,
    private formBuilder: FormBuilder,
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private loadingCtrl: LoadingController
  ) {
    this.otpForm = this.formBuilder.group({
      number: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('[0-9]*')]]
    });
  }

  ngOnInit() {
    this.stepOtp = 'send';
    this.disabledActionButton = false;
    this.setupData();
  }

  private setupData(): void {
    const userContactData: SimValidationRs = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.UserContactData);
    this.otpData.phoneNumber = userContactData.phoneNumber;
  }

  private getOtpRequest(): GetOtpReq {
    const userContactData: SimValidationRs = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.UserContactData);
    const getOtpReq = new GetOtpReq();
    getOtpReq.refType = this.otpData.refType;
    getOtpReq.name = this.otpData.name;
    getOtpReq.operator = userContactData.provider || '';
    getOtpReq.operationType = this.userFeaturesOrigin || '';
    return getOtpReq;
  }

  private getValidateOtpRequest(): ValidateOtpReq {
    const userContactData: SimValidationRs = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.UserContactData);
    const validateOtpReq = new ValidateOtpReq();
    validateOtpReq.refType = this.otpData.refType || '01';
    validateOtpReq.otpValue = this.otpForm.value.number || '';
    validateOtpReq.operator = userContactData.provider || '';
    validateOtpReq.operationType = this.userFeaturesOrigin || '';
    return validateOtpReq;
  }

  public async closeModal(isValidData: boolean): Promise<void> {
    await this.pulseModalCtrl.dismiss({ validate: isValidData });
  }

  public getButtonText(): string {
    return this.stepsDefinition[this.stepOtp].actionName;
  }

  public getStepImage(): string {
    return this.stepsDefinition[this.stepOtp].image;
  }

  public getActionButton(): void {
    this.stepsDefinition[this.stepOtp].action();
  }

  public validateControllButton(): boolean {
    return this.disabledActionButton
      || (this.stepOtp === 'validate' && this.otpForm.invalid);
  }

  public onInputKeyDown(ev: CustomEvent): void {
    const keyValidator = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e'];
    const isValid = keyValidator.filter(e => e === ev.detail.key).length > 0;
    const lengthInput = ev.detail.srcElement.value.length;
    if (lengthInput === 6 && isValid ||
      ev.detail.key === 'e' || ev.detail.key === '-' || ev.detail.key === '.') {
      document.onkeydown = () => false;
    }
  }

  public onInputKeyUp(): void {
    document.onkeydown = e => e;
  }
}

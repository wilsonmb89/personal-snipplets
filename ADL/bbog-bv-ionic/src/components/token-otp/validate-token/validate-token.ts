import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PulseModalControllerProvider } from '../../../providers/pulse-modal-controller/pulse-modal-controller';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { FunnelKeysProvider } from '../../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../../providers/funnel-events/funnel-events';
import { BdbOtpProvider } from '../../../providers/bdb-otp-provider/bdb-otp-provider';
import { boxAnimation } from '../../../components/core/utils/animations/transitions';
import { toggleAllowedOTPMapperType } from '../../../new-app/core/services-delegate/user-features/user-features-delegate.service';
import { ValidationApiService } from '../../../new-app/core/services-apis/identity-validation/validation-api.service';
import { from } from 'rxjs/observable/from';
import { catchError, switchMap, switchMapTo, take, tap, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'validate-token',
  templateUrl: 'validate-token.html',
  animations: [boxAnimation]
})
export class ValidateTokenComponent implements OnInit {

  @Input() stepToken = 'input';
  @Input() userFeaturesOrign: toggleAllowedOTPMapperType;
  @ViewChild('inputToken', { read: ElementRef }) inputToken: ElementRef;
  tokenForm: FormGroup;
  private _token = this.funnelKeys.getKeys().token;
  private tokenAttempts: number;
  tokenErrorMessage: string;

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private bdbOtpProvider: BdbOtpProvider,
    private validationApiService: ValidationApiService
  ) {
    this.tokenForm = this.formBuilder.group({
      token: ['', [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6)
      ]]
    });
  }

  ngOnInit(): void {
    this.funnelEvents.callFunnel(this._token, this._token.steps.ask);
    this.addFocusToInput();
    this.tokenAttempts = 2;
  }

  addFocusToInput(): void {
    setTimeout(() => {
      if (!!this.inputToken) {
        const pulseInput = this.inputToken.nativeElement as HTMLElement;
        if (!!pulseInput && pulseInput.getElementsByTagName('input').length > 0) {
          pulseInput.getElementsByTagName('input')[0].focus();
        }
      }
    }, 250);
  }

  onInputKeyDown(ev: CustomEvent): void {
    const keyValidator = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e'];
    const isValid = keyValidator.filter(e => e === ev.detail.key).length > 0;
    const lengthInput = ev.detail.srcElement.value.length;
    if (lengthInput === 6 && isValid ||
      ev.detail.key === 'e' || ev.detail.key === '-' || ev.detail.key === '.') {
      document.onkeydown = () => false;
    }
  }

  onInputKeyUp(): void {
    document.onkeydown = e => e;
  }

  async closeModal(): Promise<any> {
    await this.pulseModalCtrl.dismiss();
  }

  async toOtp(): Promise<any> {
    await this.pulseModalCtrl.dismiss({
      toOTP: true
    });
  }

  submitInput(): void {
    if (this.tokenForm.invalid) {
      return;
    }

    this.funnelEvents.callFunnel(this._token, this._token.steps.validate);
    const otp = this.tokenForm.value.token as string;

    this.tokenForm.setValue({
      token: ''
    });

    const loading = this.loadingCtrl.create();

    from(loading.present()).pipe(
      take(1),
      switchMapTo(this.validationApiService.getTokenInfo()),
      switchMap(token => this.validateToken(otp, token)),
      switchMap((isTokenValid) => isTokenValid ?
        from(this.pulseModalCtrl.dismiss({ validate: true })).pipe(tap(() => console.log('dispatching routing'))) :
        from(this.validateOtpDataToGoOtpModal())
      ),
      catchError(error => of(this.handleValidationError()))
    ).subscribe(_ => loading.dismiss());
  }

  getInputStatus() {
    return this.stepToken === 'wrong' ? 'error' : 'basic';
  }

  private validateToken(otpValue, tokenInfo): Observable<boolean> {
    if (tokenInfo.status !== 'Activo') {
      return of(false);
    }

    return this.validationApiService.validateOtpToken({ otpValue, tokenType: 'MOBILE' })
    .pipe(
      map(res => true),
      catchError<any, any>(error => this.tokenAttempts > 0 ? Observable.throw(new Error('Error in token validation')) : of(false))
    );
  }

  private handleValidationError() {
    if (this.tokenAttempts > 0) {
      this.stepToken = 'wrong';
      this.addFocusToInput();
      this.tokenErrorMessage  = `Código incorrecto, te queda${this.tokenAttempts === 1 ? '' : 'n'} ${this.tokenAttempts} intento${this.tokenAttempts === 1 ? '' : 's'}`;
      this.tokenAttempts--;
    } else {
      this.validateOtpDataToGoOtpModal();
    }
  }

  private async validateOtpDataToGoOtpModal(): Promise<boolean> {
    const validateUserPhoneNumber = await this.bdbOtpProvider.validateOtpData(this.userFeaturesOrign).catch(err => false);
    this.stepToken = !!validateUserPhoneNumber ? 'error' : 'need';
    return !!validateUserPhoneNumber;
  }
}

import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Events, IonicPage, NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';

import { BdbConstants } from '../../../../../../../app/models/bdb-generics/bdb-constants';
import { MobileSummaryProvider, SummaryBody, SummaryHeader } from '../../../../../../../components/mobile-summary';
import { ProgressBarProvider } from '../../../../../../../providers/progress-bar/progress-bar';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { FacipassRechargeRq } from '@app/apis/payment-nonbillers/models/facilpass-recharge.model';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';

@IonicPage({
  name: 'facilpass%set%amount',
  segment: 'facilpass-set-amount'
})
@Component({
  selector: 'facilpass-set-amount-page',
  templateUrl: './facilpass-set-amount.html'
})
export class FacilpassSetAmountPage {

  private readonly facilpassLogo = 'assets/imgs/payments/recharges/facilpass-logo.svg';
  private amountForm: FormGroup;
  private amountFormSubscription: Subscription;
  amountState = 'basic';
  amountLabelHelper = '';

  constructor(
    private events: Events,
    private navCtrl: NavController,
    private progressBar: ProgressBarProvider,
    public mobileSummary: MobileSummaryProvider,
    private formBuilder: FormBuilder,
    private bdbStorageService: BdbStorageService,
  ) {
    this.amountForm = this.formBuilder.group({
      amount: new FormControl('', [Validators.required, this.customAmountValidator()])
    });
  }

  ionViewWillEnter(): void {
    this.initPageData();
    this.events.publish('srink', true);
  }

  ionViewWillLeave(): void {
    if (!!this.amountFormSubscription) {
      this.amountFormSubscription.unsubscribe();
    }
  }

  public goPreviousPage(): void {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.goToRechargesPage();
    }
  }

  private buildHeaderMobileSummary(): void {
    const summary = this.mobileSummary.getInstance();
    if (!summary.header) {
      const header: SummaryHeader = new SummaryHeader();
      header.title = 'FacilPass';
      header.logoPath = this.facilpassLogo;
      this.mobileSummary.setHeader(header);
    }
    const body: SummaryBody = new SummaryBody();
    const amount =
      (!!this.amountForm && !!this.amountForm.get('amount').value)
        ? this.amountForm.get('amount').value
        : '';
    body.textUp = !!amount ? 'Valor a recargar:' : '';
    body.textDown = 'Costo de la recarga (sin IVA):';
    body.valueDown = 'Gratis';
    this.mobileSummary.setBody(body);
  }

  private addFormEvents(): void {
    this.amountFormSubscription = this.amountForm.valueChanges.subscribe(
      ({ amount }) => {
        const progressDetail: string[] = !!amount ? [amount] : [];
        this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, progressDetail);
        const summary = this.mobileSummary.getInstance();
        if (!!summary.body) {
          summary.body.textUp = !!amount ? 'Valor a recargar:' : '';
          summary.body.valueUp = amount;
        }
      }
    );
  }

  private setUpProgressBars(): void {
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, []);
    this.buildHeaderMobileSummary();
    this.updateFromSavedData();
  }

  private updateFromSavedData(): void {
    const facilpassData: FacipassRechargeRq = this.bdbStorageService.getItemByKey(InMemoryKeys.FacilpassData);
    const codeNIE = facilpassData.codeNIE || '';
    this.sessionRefreshProgressSummary(codeNIE);
    this.sessionRefreshMobileSummary(codeNIE);
  }

  private sessionRefreshProgressSummary(codeNURE: string): void {
    const progressBar = this.progressBar.getInstance();
    if (!!codeNURE && progressBar.steps[0].title === 'concepto') {
      this.progressBar.setLogo(this.facilpassLogo);
      this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'FacilPass');
      this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);
      this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [`NURE: ${codeNURE}`]);
      this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor de la recarga');
      this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, []);
      this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Cuenta origen');
    }
  }

  private sessionRefreshMobileSummary(codeNURE: string): void {
    let header: SummaryHeader = this.mobileSummary.getInstance().header;
    if (!!codeNURE) {
      if (!!header) {
        header.details = [`NURE: ${codeNURE}`];
      } else {
        header = new SummaryHeader();
        header.title = 'FacilPass';
        header.details = [`NURE: ${codeNURE}`];
        header.logoPath = this.facilpassLogo;
        this.mobileSummary.setHeader(header);
      }
    }
  }

  public goToRechargesPage(): void {
    this.navCtrl.setRoot(
      'PaymentsMainPage', { 'tab': 'recharge' }
    );
  }

  public onInputKeyDown(ev: CustomEvent): void {
    const keyValidator = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'e'];
    const isValid = keyValidator.filter(e => e === ev.detail.key).length > 0;
    const lengthInput = ev.detail.srcElement.value.length;
    if (lengthInput === 9 && isValid ||
      ev.detail.key === 'e' || ev.detail.key === '-' || ev.detail.key === '.') {
      document.onkeydown = () => false;
    }
  }

  public onInputKeyUp(): void {
    this.keyUpValidateAmount();
    document.onkeydown = e => e;
  }

  private keyUpValidateAmount(): void {
    const amountControl = this.amountForm.get('amount');
    if (amountControl.invalid && amountControl.errors.exceededValue) {
      this.amountState = 'error';
      this.amountLabelHelper = 'El valor debe ser menor o igual a $10,000,000.';
    } else if (this.amountForm.get('amount').valid) {
      this.amountState = 'basic';
      this.amountLabelHelper = '';
    }
  }

  public onSubmitFormAmount(): void {
    if (!!this.amountForm && this.amountForm.valid) {
      this.saveAmountData();
      this.navCtrl.push('facilpass%set%account');
    }
  }

  private saveAmountData(): void {
    const facilpassData: FacipassRechargeRq = this.bdbStorageService.getItemByKey(InMemoryKeys.FacilpassData);
    if (!!facilpassData) {
      const amount = this.amountForm.get('amount').value;
      facilpassData.amount = amount;
      this.bdbStorageService.setItemByKey(InMemoryKeys.FacilpassData, facilpassData);
    }
  }

  private initPageData(): void {
    this.setUpProgressBars();
    this.addFormEvents();
  }

  public customAmountValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const value = (control.value as string).replace(/\D/g, '');
      if (!!value) {
        const numberVal = +value;
        if (numberVal < 20000) {
          return { insufficientValue: true };
        } else if (numberVal > 10000000) {
          return { exceededValue: true };
        } else if (numberVal <= 0) {
          return { negativeValue: true };
        }
        return null;
      }
      return null;
    };
  }

  public validateAmount(): void {
    const amountControl = this.amountForm.get('amount');
    this.amountState = amountControl.valid ? 'basic' : 'error';
    this.amountLabelHelper =
      amountControl.valid
        ? ''
        : (!!amountControl.errors.insufficientValue ? 'El valor debe ser mayor o igual a $20,000.' :
        (!!amountControl.errors.exceededValue ? 'El valor debe ser menor o igual a $10,000,000.' : 'Valor inválido'));
  }

}

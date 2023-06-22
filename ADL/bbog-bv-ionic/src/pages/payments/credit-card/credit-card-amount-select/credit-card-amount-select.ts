import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { ProgressBarData } from '../../../../app/models/progress-bar';
import { CreditCardPaymentInfo } from '../../../../app/models/tc-payments/credit-card-payment-info';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';
import { CreditCardOpsProvider } from '../../../../providers/credit-card-ops/credit-card-ops';
import { CreditCardPaymentProvider } from '../../../../providers/credit-card-payment/credit-card-payment';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeyModel } from '../../../../providers/funnel-keys/funnel-key-model';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { NonZeroAmtValidator } from '../../../../validators/minAmmt';
import { TokenOtpProvider } from '../../../../providers/token-otp/token-otp/token-otp';
import { UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import {CurrencyFormatPipe} from '@app/shared/pipes/CurrencyFormat.pipe';

@PageTrack({title: 'creditcard-amount-select'})
@IonicPage({
  name: 'creditcard%amount%select',
  segment: 'creditcard-amount-select'
})
@Component({
  selector: 'page-credit-card-amount-select',
  templateUrl: 'credit-card-amount-select.html',
})
export class CreditCardAmountSelectPage implements OnInit {

  subtitle = '¿Cuánto quieres pagar?';
  abandonText = BdbConstants.ABANDON_PAY;
  backText = 'Atrás';
  otherFocus = false;
  private radioForm: FormGroup;
  totalPayment: any;
  minPayment: any;
  isMobile: boolean;
  private _funnel: FunnelKeyModel;
  @ViewChild('submitCore') submitCore;
  @ViewChild('submitMobile') submitMobile;

  nameBtnSubmit = 'Continuar';
  colorBtnSubmit = 'blue-gradient';
  ccPaymentInfo: CreditCardPaymentInfo;
  navTitle = 'Pago Tarjetas de Crédito';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbPlatforms: BdbPlatformsProvider,
    private progressBar: ProgressBarProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private accessDetail: AccessDetailProvider,
    private creditCardPayment: CreditCardPaymentProvider,
    private navigation: NavigationProvider,
    private creditCardOps: CreditCardOpsProvider,
    private events: Events,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private tokenOtpProvider: TokenOtpProvider,
    private userFeaturesService: UserFeaturesDelegateService
  ) {
    this.radioForm = this.formBuilder.group({
      choice: new FormControl('min'),
      otherAmount: new FormControl('', [Validators.required, NonZeroAmtValidator.isValid]),
    });
    this.events.publish('srink', true);
  }

  ngOnInit() {
    this.radioForm.get('otherAmount').disable();
    this.onChanges();
    this.isMobile = this.bdbPlatforms.isMobile();
  }

  ionViewDidLoad() {
    this.ccPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CreditCardInfo);

    const creditCard = this.ccPaymentInfo.creditCard.accountOwned;
    this.totalPayment = creditCard.balanceDetail.totalFechaBBOG;
    this.minPayment = creditCard.balanceDetail.pagMinimoBBOG;

    const franchiseInfo = creditCard.franchise;
    const progressBarData = new ProgressBarData(
      creditCard.productName,
      null,
      BdbConstants.BBOG_LOGO_WHITE,
      `${franchiseInfo} ${creditCard.productNumber}`
    );
    this._funnel = this.funnelKeys.getKeys().cards;
    this.creditCardPayment.updateProgressBarCreditCard(progressBarData);
    if (this.accessDetail.isOriginSelected()) {
      this.nameBtnSubmit = 'Confirmar pago';
      this.colorBtnSubmit = 'mango-gradient';
       this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }
    this.updateSelectedValue();
  }

  public submitAmountSelect(): void {
    this.userFeaturesService.getUserSettings().subscribe(
      (settings) => {
        if (Number(this.ccPaymentInfo.amount) >= settings.amounts.maxAmountBeforeRequestSecurity) {
          this.tokenOtpProvider.requestToken(this.viewRef, this.resolver,
            () => {
              this.launchCreditCardPayment();
            }, 'creditCardPayment');

        } else {
          this.launchCreditCardPayment();
        }

      }, (e) => this.launchCreditCardPayment());

  }


  private launchCreditCardPayment(): void {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.amount);
    this.updateSelectedValue();
    const ccPaymentInfo: CreditCardPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CreditCardInfo);
    if (this.accessDetail.isOriginSelected()) {
      ccPaymentInfo.account = this.accessDetail.getOriginSelected();
      this.bdbInMemory.setItemByKey(InMemoryKeys.CreditCardInfo, ccPaymentInfo);
      this.creditCardOps.sendPayment(ccPaymentInfo, this._funnel, this.navCtrl, this.viewRef);
    } else {
      this.navCtrl.push('CreditCardSelectPaymentPage');
    }
  }

  updateSelectedValue() {
    switch (this.radioForm.get('choice').value) {
      case 'min': {
        this.ccPaymentInfo.amount = this.minPayment;
        break;
      }
      case 'other': {
        this.ccPaymentInfo.amount = CurrencyFormatPipe.unFormat(this.radioForm.value.otherAmount.toString());
        break;
      }
      case 'total': {
        this.ccPaymentInfo.amount = this.totalPayment;
        break;
      }
    }
    this.ccPaymentInfo.paymentType = BdbConstants.PC_NORMAL_PAYMENT;
    this.ccPaymentInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;

    this.bdbInMemory.setItemByKey(InMemoryKeys.CreditCardInfo, this.ccPaymentInfo);
    this.updateProgressBarStep2([
      `${CurrencyFormatPipe.format(this.ccPaymentInfo.amount)}`,
      `Costo: ${BdbConstants.TRANSACTION_COST.NO_COST}`
    ]);
  }

  onChanges(): void {
    this.radioForm.get('choice').valueChanges.subscribe(val => {
      if (val === 'other') {
        this.radioForm.get('otherAmount').enable();
        this.otherFocus = true;
      } else {
        this.radioForm.patchValue({otherAmount: ''});
        this.radioForm.get('otherAmount').disable();
        this.otherFocus = false;
      }
      this.updateSelectedValue();
    });
  }

  public onTextChange(event): void {
    this.radioForm.controls['otherAmount'].setValue(event.target.value);
    this.updateSelectedValue();
  }

  updateProgressBarStep2(details: Array<string>) {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, details);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
  }

  enableOther() {
    this.radioForm.get('choice').setValue('other');
  }

  onBackPressed() {
    this.navCtrl.pop();
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }
}

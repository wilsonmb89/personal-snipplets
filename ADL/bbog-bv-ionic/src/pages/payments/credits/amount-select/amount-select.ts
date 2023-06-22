import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { LoanPaymentInfo } from '../../../../app/models/credits/loan-payment-info';
import { ProgressBarData } from '../../../../app/models/progress-bar';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { CreditPaymentProvider } from '../../../../providers/credit-payment/credit-payment';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeyModel } from '../../../../providers/funnel-keys/funnel-key-model';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { LoanOpsProvider } from '../../../../providers/loan-ops/loan-ops';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { NonZeroAmtValidator } from '../../../../validators/minAmmt';
import { TokenOtpProvider } from '../../../../providers/token-otp/token-otp/token-otp';
import { UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import { ObligationPaymentsService } from '../../../../new-app/modules/payments/services/obligation-payments.service';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';
import {PulseTooltipInfoData, TooltipInfoOptions} from '@app/shared/utils/bdb-pulse-ops-services/models/tooltip-info-options.model';
import {TooltipInfoOpsProvider} from '@app/shared/utils/bdb-pulse-ops-services/tooltip-info-ops';
import {ProductDetail} from '../../../../app/models/products/product-model';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';
import {take} from 'rxjs/operators';

@PageTrack({ title: 'credit-amount-select' })
@IonicPage({
  name: 'credit%amount%select',
  segment: 'loan-payment-amount',
})
@Component({
  selector: 'page-amount-select',
  templateUrl: 'amount-select.html',
})
export class AmountSelectPage implements OnInit {

  subtitle = '¿Cuánto quieres pagar?';
  abandonText = BdbConstants.ABANDON_PAY;
  backText = 'Atrás';
  navTitle = 'Pago Crédito';
  otherFocus = false;
  extraFocus = false;
  totalPayment: any;
  minPayment: any;
  peSelected = true;
  invalid = true;
  isMobile: boolean;
  nameBtnSubmit = 'Continuar';
  colorBtnSubmit = 'bdb-blue';
  loanPaymentInfo: LoanPaymentInfo;
  hasAdvancePayment = false;
  showAdvancePayment = false;
  paymentTypes: PaymentTypeOption[] = [];
  paymentType: string;
  flagPage: string;
  errLabelValueOtherExist = false;
  errLabelValueExtraExist = false;
  private radioForm: FormGroup;
  private _funnel: FunnelKeyModel = this.funnelKeys.getKeys().credits;

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
    private creditPayment: CreditPaymentProvider,
    private loanOps: LoanOpsProvider,
    private bdbUtils: BdbUtilsProvider,
    private events: Events,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private tokenOtpProvider: TokenOtpProvider,
    private userFeaturesService: UserFeaturesDelegateService,
    private obligationPaymentsService: ObligationPaymentsService,
    private tooltipInfoOpsProvider: TooltipInfoOpsProvider,
    private userFacade: UserFacade,
  ) {
    this.radioForm = this.formBuilder.group({
      choice: new FormControl('min'),
      otherAmount: new FormControl('', [Validators.required, NonZeroAmtValidator.isValid]),
      extraAmount: new FormControl('', [Validators.required, NonZeroAmtValidator.isValid]),
      paymentType: [BdbConstants.PC_NORMAL_PAYMENT]

    });

    if (this.accessDetail.isOriginSelected()) {
      this.nameBtnSubmit = 'Confirmar pago';
      this.colorBtnSubmit = 'mango';
    }
  }

  ngOnInit() {
    this.flagPage = this.navParams.get('flag');
    this.radioForm.patchValue({});
    this.radioForm.get('otherAmount').disable();
    this.radioForm.get('extraAmount').disable();
    this.onChanges();
    this.isMobile = this.bdbPlatforms.isMobile();
    this.buildPaymentTypeOptions();
    this.creditFullData();
    this.checkAdvancePayment();
  }

  creditFullData() {
    this.loanPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanPaymentInfo);
    const mProperties = this.bdbUtils.getPaymentAvailable(this.loanPaymentInfo.loan.accountOwned.productType);
    this.minPayment = this.loanPaymentInfo.loan.accountOwned.balanceDetail[mProperties[0]];
    this.totalPayment = this.loanPaymentInfo.loan.accountOwned.balanceDetail[mProperties[1]];
    const progressBarData = new ProgressBarData(
      this.loanPaymentInfo.loan.accountOwned.productName,
      null,
      BdbConstants.BBOG_LOGO_WHITE,
      `${this.loanPaymentInfo.loan.accountOwned.productNumber}`
    );

    this.creditPayment.updateProgressBarCredit(progressBarData);

    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }

    this.updateSelectedValue();
  }

  ionViewWillEnter() {
    this.events.publish('srink', true);
  }

  public submitAmountSelect(): void {
  this.userFeaturesService.getUserSettings().subscribe(
      (settings) => {
        if (Number(this.loanPaymentInfo.amount) >= settings.amounts.maxAmountBeforeRequestSecurity) {
          this.tokenOtpProvider.requestToken(this.viewRef, this.resolver,
            () => {
              this.launchLoanPayment();
            }, 'creditPayment');

        } else {
          this.launchLoanPayment();
        }

      }, (e) => this.launchLoanPayment());
  }


  private launchLoanPayment(): void {
    this.updateSelectedValue();
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.amount);
    const loanPaymentInfo: LoanPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanPaymentInfo);
    if (this.accessDetail.isOriginSelected()) {
      loanPaymentInfo.account = this.accessDetail.getOriginSelected();
      this.bdbInMemory.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);
      loanPaymentInfo.paymentType = loanPaymentInfo.paymentType;
      this.obligationPaymentsService.payObligations(this._funnel, loanPaymentInfo, this.navCtrl, this.viewRef);
    } else {
      loanPaymentInfo.paymentType = loanPaymentInfo.paymentType;
      this.bdbInMemory.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);
      this.navCtrl.push('LoanSelectPaymentPage');

    }
  }

  public onTextChange(event): void {
    this.radioForm.controls['otherAmount'].setValue(event.target.value);
    this.changeCssClass();
    this.updateSelectedValue();
  }

  private changeCssClass() {
    const valueOther = this.radioForm.controls['otherAmount'];
    const valueExtra = this.radioForm.controls['extraAmount'];
    valueOther.status !== 'VALID' ? this.errLabelValueOtherExist = true : this.errLabelValueOtherExist = false;
    valueExtra.status !== 'VALID' ? this.errLabelValueExtraExist = true : this.errLabelValueExtraExist = false;
  }

  updateSelectedValue() {
    const loanPaymentInfo: LoanPaymentInfo = this.loanPaymentInfo;
    if (!!loanPaymentInfo) {
      switch (this.radioForm.get('choice').value) {
        case 'min': {
          loanPaymentInfo.paymentType = BdbConstants.PC_NORMAL_PAYMENT;
          loanPaymentInfo.amount = this.minPayment;
          break;
        }
        case 'total': {
          loanPaymentInfo.paymentType = BdbConstants.PC_NORMAL_PAYMENT;
          loanPaymentInfo.amount = this.totalPayment;
          break;
        }
        case 'other': {
          loanPaymentInfo.paymentType = BdbConstants.PC_NORMAL_PAYMENT;
          loanPaymentInfo.amount = CurrencyFormatPipe.unFormat(this.radioForm.value.otherAmount.toString());
          break;
        }
        case 'extra': {
          loanPaymentInfo.paymentType = this.loanPaymentInfo.paymentType;
          loanPaymentInfo.amount = CurrencyFormatPipe.unFormat(this.radioForm.value.extraAmount.toString());
          break;
        }
      }
      this.updateProgressBarStep2([
        `${CurrencyFormatPipe.format(loanPaymentInfo.amount)}`,
        `Costo: ${BdbConstants.TRANSACTION_COST.NO_COST}`
      ]);
    }

    this.bdbInMemory.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);
  }

  updateProgressBarStep2(details: Array<string>) {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, details);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
  }

   enableOther() {
    this.radioForm.get('choice').setValue('other');
    this.paymentType = BdbConstants.PC_NORMAL_PAYMENT;
    this.changeCssClass();
  }

  enableExtra() {
    this.radioForm.get('choice').setValue('extra');
    this.loanPaymentInfo.paymentType = BdbConstants.PC_DECREASE_TERM;
    this.changeCssClass();
  }

  onChanges(): void {
    this.radioForm.get('choice').valueChanges.subscribe(val => {
      switch (val) {
        case 'other': {
          this.radioForm.get('extraAmount').disable();
          this.radioForm.get('otherAmount').enable();
          this.radioForm.patchValue({ extraAmount: ''});
          this.extraFocus = false;
          this.otherFocus = true;
          break;
        }
        case 'extra': {
          this.radioForm.get('otherAmount').disable();
          this.radioForm.get('extraAmount').enable();
          this.radioForm.patchValue({ otherAmount: ''});
          this.otherFocus = false;
          this.extraFocus = true;
          break;
        }
        default: {
          this.radioForm.patchValue({ otherAmount: ''});
          this.radioForm.patchValue({ extraAmount: '' });
          this.radioForm.get('otherAmount').disable();
          this.radioForm.get('extraAmount').disable();
          this.otherFocus = false;
          this.extraFocus = false;
          break;
        }
      }

      this.updateSelectedValue();
    });
  }

  toggleExtraBtn(btn: string) {
    if (btn === 'left') {
      this.peSelected = true;
    } else {
      this.peSelected = false;
    }
  }


  onBackPressed() {
    this.navCtrl.pop();
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }
  // TO DO: unsubscribe from services
  private checkAdvancePayment(): void {
     this.userFacade.userFeatures$.pipe(take(1)).subscribe(userFeatures => {
      this.showAdvancePayment = userFeatures.toggle.allowedServices.extraordinaryPaymentCredit;
    });
    if (this.flagPage === 'bdbCardDetail') {
      let productDetail: ProductDetail;
      productDetail = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductDetail);
      this.hasAdvancePayment = !! productDetail ? productDetail.hasAdvancePmnt : false;
    } else {
      this.hasAdvancePayment = !! this.loanPaymentInfo ?
      this.loanPaymentInfo.loan.accountOwned.hasAdvancePmnt : false ;
    }
  }

  public changePaymentType(value: string): void {
    this.paymentTypes.forEach(paymentType => {
      paymentType.selected = paymentType.value === value;
    });
    this.radioForm.get('paymentType').setValue(value);
    this.loanPaymentInfo.paymentType = value;
  }

  private buildPaymentTypeOptions(): void {
    this.paymentTypes = [
      {
        selected: true,
        name: 'Reducir Plazo',
        value: BdbConstants.PC_DECREASE_TERM
      },
      {
        selected: false,
        name: 'Reducir Cuota',
        value: BdbConstants.PC_REDUCE_INSTALLMENT
      }
    ];
  }

  public showTooltip(htmlElement: HTMLElement): void {
    const tooltipInfo = new Array<PulseTooltipInfoData>();
    tooltipInfo.push({title: 'Reducir plazo:', description: 'Abono a capital para disminuir el tiempo del crédito.'});
    tooltipInfo.push({title: 'Reducir cuota:', description: 'Abono a intereses para disminuir la cuota mensual.'});
    const tooltipOptions: TooltipInfoOptions = {
      content: tooltipInfo,
      htmlelementref: htmlElement,
      id: 'stf_tooltip_1',
      orientation: 'right-start',
      size: 's'
    };
    this.tooltipInfoOpsProvider.presentToolTip(tooltipOptions).subscribe();
  }

}

interface PaymentTypeOption {
  selected: boolean;
  name: string;
  value: string;
}

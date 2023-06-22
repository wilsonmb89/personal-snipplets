import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { LoanPaymentInfo } from '../../../../app/models/credits/loan-payment-info';
import { AccountAny } from '../../../../app/models/enrolled-transfer/account-any';
import { ProgressBarData } from '../../../../app/models/progress-bar';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { CreditPaymentProvider } from '../../../../providers/credit-payment/credit-payment';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeyModel } from '../../../../providers/funnel-keys/funnel-key-model';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { TokenOtpProvider } from '../../../../providers/token-otp/token-otp/token-otp';
import { UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import { ObligationPaymentsService } from '@app/modules/payments/services/obligation-payments.service';
import { NonZeroAmtValidator } from '../../../../validators/minAmmt';
import { CreditByBank } from '@app/apis/user-features/models/catalogue.model';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { Observable } from 'rxjs/Observable';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';

@PageTrack({title: 'enrolled-amount'})
@IonicPage({
  segment: 'enrolled%amount'
})
@Component({
  selector: 'page-enrolled-amount-credits',
  templateUrl: 'enrolled-amount-credits.html',
})
export class EnrolledAmountCreditsPage {

  amountForm: FormGroup;
  cost: string;
  productSelected: AccountAny;
  subtitle: string;
  inputPh: string;
  abandonText = BdbConstants.ABANDON_PAY;
  nameBtnSubmit = 'Continuar';
  colorBtnSubmit = 'bdb-blue';
  navTitle = 'Pago Crédito';
  leftHdrOption = 'Atrás';
  hideLeftOption = false;
  typeCreditsByBank: Observable<CreditByBank []>;
  bankSelected: string;

  private _funnel: FunnelKeyModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private progressBar: ProgressBarProvider,
    private creditPayment: CreditPaymentProvider,
    private accessDetail: AccessDetailProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private navigation: NavigationProvider,
    public events: Events,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private tokenOtpProvider: TokenOtpProvider,
    private userFeaturesService: UserFeaturesDelegateService,
    private obligationPaymentsService: ObligationPaymentsService,
    private userFacade: UserFacade
  ) {
    this.amountForm = this.formBuilder.group({
      amount: ['', [Validators.required, NonZeroAmtValidator.isValid]],
      creditType: ['d', [Validators.required]]
    });

    this.inputPh = 'Digita el valor';

    if (!!navParams.get('subscribe')) {
      this.leftHdrOption = '';
      this.hideLeftOption = true;
      events.publish('header:btn:remove', 'left');
    }
    this.events.publish('srink', true);
  }

  ionViewWillEnter() {
    this.subtitle = '¿Cuánto quieres pagar?';
    const loanPaymentInfo: LoanPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanPaymentInfo);
    this.productSelected = loanPaymentInfo.loan;
    this.cost = 'Esta transacción no tiene costo adicional';

    const progressBarData = new ProgressBarData(
      this.productSelected.accountEnrolled.productAlias,
      this.productSelected.accountEnrolled.contraction,
      null,
      `${this.productSelected.accountEnrolled.productNumber}`
    );

    this.creditPayment.updateProgressBarCredit(progressBarData);

    if (this.accessDetail.isOriginSelected()) {
      this.nameBtnSubmit = 'Confirmar pago';
      this.colorBtnSubmit = 'mango';
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }

    this._funnel = this.funnelKeys.getKeys().credits;
    if (!loanPaymentInfo.loan.accountEnrolled.bankId.endsWith(BdbConstants.BBOG)) {
      this.getCreditTypesByBankId();
    }
  }

  ionViewDidEnter() {
    const loanPaymentInfo: LoanPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanPaymentInfo);
    this.bankSelected = loanPaymentInfo.loan.accountEnrolled.bankId;
  }

  ionViewWillLeave() {
    this.events.publish('header:btn:add');
  }

  public onTextChange(event): void {
    this.amountForm.controls['amount'].setValue(event.target.value);
    const unmaskedAmt: string = this.amountForm.value.amount.toString();
    this.updateProgressBarStep2([
      `${CurrencyFormatPipe.format(unmaskedAmt)}`,
      `Costo: ${BdbConstants.TRANSACTION_COST.NO_COST}`
    ]);
  }

  updateProgressBarStep2(details: Array<string>) {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, details);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
  }

  public triggerSelectAcct(): void {
    this.userFeaturesService.getUserSettings().subscribe(
      (settings) => {
        if (this.amountForm.value.amount >= settings.amounts.maxAmountBeforeRequestSecurity) {
          this.tokenOtpProvider.requestToken(this.viewRef, this.resolver,
            () => {
              this.launchCreditPayment();
            }, 'creditPayment');

        } else {
          this.launchCreditPayment();
        }

      }, (e) => this.launchCreditPayment());
  }


  private launchCreditPayment(): void {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.amount);

    const loanPaymentInfo: LoanPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanPaymentInfo);

    loanPaymentInfo.amount = CurrencyFormatPipe.unFormat(this.amountForm.value.amount.toString());
    loanPaymentInfo.paymentType = BdbConstants.PC_NORMAL_PAYMENT;
    if (!this.validateBankSelected()) {
      loanPaymentInfo.loan.accountEnrolled.productType = this.amountForm.value.creditType.type;
      loanPaymentInfo.loan.accountEnrolled.productSubType = this.amountForm.value.creditType.subType;
    } else {
      loanPaymentInfo.loan.accountEnrolled.productSubType = 'Other';
    }
    this.bdbInMemory.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);


    if (this.accessDetail.isOriginSelected()) {
      loanPaymentInfo.account = this.accessDetail.getOriginSelected();
      this.bdbInMemory.setItemByKey(InMemoryKeys.LoanPaymentInfo, loanPaymentInfo);
      this.obligationPaymentsService.payObligations(this._funnel, loanPaymentInfo, this.navCtrl, this.viewRef);
    } else {
      this.navCtrl.push('LoanSelectPaymentPage');
    }
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  private getCreditTypesByBankId(): void {
    const loanPaymentInfo: LoanPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanPaymentInfo);
    this.typeCreditsByBank = this.userFacade.creditTypesByBank$(loanPaymentInfo.loan.accountEnrolled.bankId);
  }

  get disableValidationForm(): boolean {
    return this.amountForm.controls.amount.invalid ||
      (!this.validateBankSelected() && this.amountForm.controls['creditType'].value === 'd');
  }

  private validateBankSelected(): boolean {
    const loanPaymentInfo: LoanPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanPaymentInfo);
    this.bankSelected = loanPaymentInfo.loan.accountEnrolled.bankId;
    return this.bankSelected.endsWith(BdbConstants.BBOG);
  }

}

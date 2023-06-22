import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { AccountAny } from '../../../../app/models/enrolled-transfer/account-any';
import { ProgressBarData } from '../../../../app/models/progress-bar';
import { CreditCardPaymentInfo } from '../../../../app/models/tc-payments/credit-card-payment-info';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { CreditCardOpsProvider } from '../../../../providers/credit-card-ops/credit-card-ops';
import { CreditCardPaymentProvider } from '../../../../providers/credit-card-payment/credit-card-payment';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { TokenOtpProvider } from '../../../../providers/token-otp/token-otp/token-otp';
import { NonZeroAmtValidator } from '../../../../validators/minAmmt';
import {CurrencyFormatPipe} from '@app/shared/pipes/CurrencyFormat.pipe';

@PageTrack({ title: 'creditcard-enrolled-amount' })
@IonicPage({
  segment: 'creditcard-enrolled-amount',
  name: 'creditcard%enrolled%amount'
})
@Component({
  selector: 'page-enrolled-amount-credit-card',
  templateUrl: 'enrolled-amount-credit-card.html',
})
export class EnrolledAmountCreditCardPage {

  amountForm: FormGroup;
  cost: string;
  subtitle: string;
  inputPh: string;
  mCreditCard: AccountAny;
  abandonText = BdbConstants.ABANDON_PAY;
  nameBtnSubmit = 'Continuar';
  colorBtnSubmit = 'bdb-blue';
  navTitle = 'Pago Tarjeta de Crédito';
  leftHdrOption = 'Atrás';
  hideLeftOption = false;

  _funnel = this.funnelKeys.getKeys().enrollCreditCards;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private progressBar: ProgressBarProvider,
    private creditCardPayment: CreditCardPaymentProvider,
    private accessDetail: AccessDetailProvider,
    private funnelKeys: FunnelKeysProvider,
    private navigation: NavigationProvider,
    private creditCardOps: CreditCardOpsProvider,
    public events: Events,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private tokenOtpProvider: TokenOtpProvider,
    private userFeaturesService: UserFeaturesDelegateService
  ) {

    this.amountForm = this.formBuilder.group({
      amount: ['', [Validators.required, NonZeroAmtValidator.isValid]]
    });
    this.inputPh = 'Digita el valor';

    if (this.accessDetail.isOriginSelected()) {
      this.nameBtnSubmit = 'Confirmar pago';
      this.colorBtnSubmit = 'mango';
    }

    if (!!navParams.get('subscribe')) {
      this.leftHdrOption = '';
      this.hideLeftOption = true;
      events.publish('header:btn:remove', 'left');
    }
  }

  ionViewWillLeave() {
    this.events.publish('header:btn:add');
    this.events.publish('srink', true);
  }


  public onTextChange(event): void {
    this.amountForm.controls['amount'].setValue(event.target.value);
    const unmaskedAmt: string = this.amountForm.value.amount.toString();
    this.updateProgressBarStep2([
      `${CurrencyFormatPipe.format(unmaskedAmt)}`,
      `Costo: ${BdbConstants.TRANSACTION_COST.NO_COST}`
    ]);
  }

  ionViewDidLoad() {

    this.subtitle = '¿Cuánto quieres pagar?';
    const ccPaymentInfo: CreditCardPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CreditCardInfo);
    this.mCreditCard = ccPaymentInfo.creditCard;
    this.cost = 'Esta transacción no tiene costo adicional';
    const productNumber = this.mCreditCard.accountEnrolled.productNumber;
    const franchiseInfo = this.mCreditCard.accountEnrolled.productSubType === 'MC' ? 'MasterCard' : 'VISA';
    const obfuscated = productNumber.substring(productNumber.length - 4);

    const progressBarData = new ProgressBarData(
      this.mCreditCard.accountEnrolled.productAlias,
      this.mCreditCard.accountEnrolled.productAlias,
      null,
      `${franchiseInfo} ****${obfuscated}`
    );
    this.creditCardPayment.updateProgressBarCreditCard(progressBarData);
    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }
  }

  public triggerSelectAcct(): void {
    this.userFeaturesService.getUserSettings().subscribe(
      (settings) => {
        if (Number(this.amountForm.value.amount) >= settings.amounts.maxAmountBeforeRequestSecurity) {
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
    const ccPaymentInfo: CreditCardPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CreditCardInfo);
    ccPaymentInfo.amount = CurrencyFormatPipe.unFormat(this.amountForm.value.amount.toString());
    ccPaymentInfo.paymentType = BdbConstants.PC_NORMAL_PAYMENT;
    this.bdbInMemory.setItemByKey(InMemoryKeys.CreditCardInfo, ccPaymentInfo);

    if (this.accessDetail.isOriginSelected()) {
      ccPaymentInfo.account = this.accessDetail.getOriginSelected();
      this.bdbInMemory.setItemByKey(InMemoryKeys.CreditCardInfo, ccPaymentInfo);
      this.creditCardOps.sendPayment(ccPaymentInfo, this._funnel, this.navCtrl, this.viewRef);
    } else {
      this.navCtrl.push('CreditCardSelectPaymentPage');
    }
  }


  updateProgressBarStep2(details: Array<string>) {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, details);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }
}

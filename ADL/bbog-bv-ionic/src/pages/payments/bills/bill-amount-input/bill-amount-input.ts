import {Component, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Events, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { BillPaymentInfo } from '../../../../app/models/bills/bill-payment-info';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeyModel } from '../../../../providers/funnel-keys/funnel-key-model';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { NonZeroAmtValidator } from '../../../../validators/minAmmt';
import { TokenOtpProvider } from '../../../../providers/token-otp/token-otp/token-otp';
import { PayBillDelegateService } from '@app/delegate/payment-billers-delegate/pay-bill-delegate.service';
import { PayBillRs } from '../../../../new-app/core/services-apis/payment-billers/models/payment-billers-api.model';
import { TimeoutProvider } from '../../../../providers/timeout/timeout';
import { UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { TrxResultBillService } from '@app/shared/modules/transaction-result/services/payments/transaction-result-bill.service';
import { Subscription } from 'rxjs/Subscription';

@PageTrack({ title: 'bill-amount-input' })
@IonicPage({
  segment: 'bill-amount-input',
  name: 'bill%amount%input'
})
@Component({
  selector: 'page-bill-amount-input',
  templateUrl: 'bill-amount-input.html',
})
export class BillAmountInputPage {

  private amountForm: FormGroup;
  aval: boolean;
  subtitle: string;
  cost = '';
  conceptActive = false;
  origin: string;
  inputPh: string;
  nameBtnSubmit = 'Continuar';
  colorBtnSubmit = 'bdb-blue';
  leftHdrOption = 'Atrás';
  hideLeftOption = false;
  navTitle = 'Pago de servicios';
  abandonText = BdbConstants.ABANDON_PAY;
  formSubscription: Subscription;

  private _funnel: FunnelKeyModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbMask: BdbMaskProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private progressBar: ProgressBarProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private events: Events,
    private accessDetail: AccessDetailProvider,
    private loading: LoadingController,
    private navigation: NavigationProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private tokenOtpProvider: TokenOtpProvider,
    private userFeaturesService: UserFeaturesDelegateService,
    private txResultService: TrxResultBillService,
    private payBillDelegateService: PayBillDelegateService,
    private timeoutProvider: TimeoutProvider,
  ) {
    this.amountForm = this.formBuilder.group({
      amount: ['', [Validators.required, NonZeroAmtValidator.isValid]],
    });
    this.inputPh = 'Digita el valor';

    if (!!navParams.get('subscribe')) {
      this.leftHdrOption = '';
      this.hideLeftOption = true;
    }
  }

  ionViewWillEnter() {
    this.events.publish('srink', true);
    this.addFormChengeListener();
  }

  ionViewDidLoad() {

    this._funnel = this.funnelKeys.getKeys().bills;
    this.subtitle = '¿Cuánto quieres pagar?';
    const info: BillPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.BillPaymentInfo);
    const selectedBill = info.bill;
    this.progressBar.resetObject();
    this.progressBar.setLogo('');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Servicio');
    this.progressBar.setContraction(selectedBill.contraction);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [
      selectedBill.nickname,
      selectedBill.invoiceNum
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);

    if (this.accessDetail.isOriginSelected()) {
      this.nameBtnSubmit = 'Confirmar pago';
      this.colorBtnSubmit = 'mango';
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }
  }

  ionViewWillLeave(): void {
    if (!!this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  private addFormChengeListener(): void {
    this.formSubscription = this.amountForm.valueChanges.subscribe(({ amount }) => {
      this.updateSelectedValue(amount);
    });
  }

  private updateSelectedValue(amtVal: string): void {
    this.updateProgressBarStep2(
      !!amtVal ?
        [amtVal, `Costo: ${BdbConstants.TRANSACTION_COST.NO_COST}`]
        : []
    );
  }

  private updateProgressBarStep2(details: Array<string>): void {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, details);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
  }

  public triggerSelectAcct(): void {
    this.userFeaturesService.getUserSettings().subscribe(
      (settings) => {
        const amount = +(this.amountForm.value.amount.toString().replace(/\D+/g, ''));
        if (amount >= settings.amounts.maxAmountBeforeRequestSecurity) {
          this.tokenOtpProvider.requestToken(this.viewRef, this.resolver,
            () => {
              this.launchBillPayment();
            }, 'billPayment');

        } else {
          this.launchBillPayment();
        }

      }, (e) => this.launchBillPayment());
  }

  private launchBillPayment(): void {
    const billPaymentInfo: BillPaymentInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.BillPaymentInfo);
    billPaymentInfo.amount = this.amountForm.value.amount.toString().replace(/\D+/g, '');
    this.bdbInMemory.setItemByKey(InMemoryKeys.BillPaymentInfo, billPaymentInfo);
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.amount);
    if (this.accessDetail.isOriginSelected()) {
      billPaymentInfo.account = this.accessDetail.getOriginSelected();
      this.bdbInMemory.setItemByKey(InMemoryKeys.BillPaymentInfo, billPaymentInfo);
      this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.confirmation);
      this.processBillPayment(billPaymentInfo);
    } else {
      this.navCtrl.push('BillSelectPaymentPage');
    }
  }

  private processBillPayment(billPaymentInfo: BillPaymentInfo): void {
    const loading = this.loading.create();
    loading.present();

    const transferProcess: Observable<PayBillRs> = this.payBillDelegateService.payBill(billPaymentInfo);
    const validateTimeOut$ = this.timeoutProvider.validateTimeOut(transferProcess);

    validateTimeOut$.subscribe({
      next: (payBillRs: PayBillRs) => {
        this.buildResultData(billPaymentInfo, true, payBillRs.approvalId);
      },
      error: (ex) => {
        try {
          loading.dismiss();
          if (ex.status === 504 || ex.error.errorMessage.toLowerCase().match('timeout')) {
            this.launchInfoPageTimeOut(billPaymentInfo);
          } else {
            this.buildResultData(billPaymentInfo, false, '', ex.error ? ex.error : null);
          }
        } catch (error) {
          this.buildResultData(billPaymentInfo, false);
        }
      },
      complete: () => {
        loading.dismiss();
      }
    });
  }

  private launchInfoPageTimeOut(billPaymentInfo: BillPaymentInfo): void {
    this.navCtrl.push('OperationInfoPage', {
      data: {
        amount: Number(billPaymentInfo.amount),
        amountText: 'Valor del servicio',
        bodyText: `Estamos presentando demoras.
                  <span class="pulse-tp-bo3-comp-b"> Si no ves reflejada la transacción
                  en los movimientos de tu cuenta en las próximas horas</span>,
                  intenta de nuevo.`,
        bodyTitle: 'Está tardando más de lo normal',
        buttonText: 'Entendido',
        dateTime: new Date().getTime(),
        image: 'assets/imgs/time-out-page/clock-warning.svg',
        title: 'Transacción en <span class="pulse-tp-hl3-comp-b">proceso</span>',
        buttonAction: () => {
          this.navCtrl.push('DashboardPage');
        }
      }
    });

  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  private buildResultData(
    billPaymentInfo: BillPaymentInfo,
    isSuccess: boolean,
    approvalId: string = '',
    errorData?: ApiGatewayError,
  ): void {
    const state: TransactionResultState = !isSuccess ? 'error' : 'success';
    this.txResultService.launchResultTransfer(this.navCtrl, state, billPaymentInfo, approvalId, errorData);
  }
}

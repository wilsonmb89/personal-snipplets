import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { TrxResultRechargeService } from '@app/shared/modules/transaction-result/services/payments/transaction-result-recharge.service';
import { Events, IonicPage, LoadingController, NavController, NavParams, Slides } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { BdbMap } from '../../../../app/models/bdb-generics/bdb-map';
import { ModalRs } from '../../../../app/models/modal-rs/modal-rs';
import { RechargeInfo } from '../../../../app/models/recharges/recharge-info';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../../../providers/bdb-mask/bdb-mask-type.enum';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';
import { CarriersRepoProvider } from '../../../../providers/carriers-repo/carriers-repo';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { RechargeOpsProvider } from '../../../../providers/recharge-ops/recharge-ops';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';


@PageTrack({ title: 'recharge-amount-input' })
@IonicPage({
  name: 'recharge%amount%input',
  segment: 'recharge-amount-input'
})
@Component({
  selector: 'page-amount-input',
  templateUrl: 'amount-input.html',
})
export class AmountInputPage implements OnInit {

  @ViewChild(Slides) slides: Slides;

  subtitle = '¿Cuánto quieres recargar?';

  abandonText = BdbConstants.ABANDON_PAY;

  selectedCarrier: BdbMap;
  phoneNumber: string;
  private carriers: BdbMap[];
  public ammtErr: string;
  private defaultamounts: number[];
  private amountForm: FormGroup;
  private isMobile = false;
  private _recharges = this.funnelKeys.getKeys().recharges;
  navTitle = 'Recargas';
  nameBtnSubmit = 'Continuar';
  colorBtnSubmit = 'bdb-blue';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbPlatforms: BdbPlatformsProvider,
    private carrierRepo: CarriersRepoProvider,
    private bdbMask: BdbMaskProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private progressBar: ProgressBarProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private accessDetail: AccessDetailProvider,
    private navigation: NavigationProvider,
    private loading: LoadingController,
    private rechargeOps: RechargeOpsProvider,
    private events: Events,
    private txResultService: TrxResultRechargeService,
  ) {
    const rechargeInfo: RechargeInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.RechargeInfo);
    this.selectedCarrier = rechargeInfo.carrier;
    this.carriers = carrierRepo.getRepo();
    this.defaultamounts = this.carrierRepo.getDefaultValues(this.selectedCarrier.key);
    this.isMobile = bdbPlatforms.isMobile();

    this.amountForm = this.formBuilder.group({
      amount: ['', [Validators.required, this.isValid.bind(this)]]
    });
  }

  ngOnInit() {
    // disable swipping action for browser
    if (!this.isMobile) {
      this.slides.lockSwipes(true);
    }
  }

  ionViewWillEnter() {

    const rechargeInfo: RechargeInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.RechargeInfo);

    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [
      rechargeInfo.phoneNumber
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);

    if (this.accessDetail.isOriginSelected()) {
      this.nameBtnSubmit = 'Confirmar pago';
      this.colorBtnSubmit = 'mango';
      this.accessDetail.updateProgressBarDoneRecharge(this.accessDetail.getOriginSelected());
    } else {
      this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_4, null);
      this.progressBar.setDone(BdbConstants.PROGBAR_STEP_4, false);
    }
    this.events.publish('srink', true);
  }

  isValid(control: FormControl) {
    if (control.value !== undefined && this !== undefined && this.selectedCarrier !== undefined) {
      const amountToRecharge: number = +control.value.toString().replace(/\D+/g, '');
      switch (this.selectedCarrier.key) {
        case this.carriers[0].key: {
          return this.validateClaro(amountToRecharge) === null ?
            this.updateSelectedValue(amountToRecharge) : this.validateClaro(amountToRecharge);
        }
        case this.carriers[1].key: {
          return this.validateMovistar(amountToRecharge) === null ?
            this.updateSelectedValue(amountToRecharge) : this.validateMovistar(amountToRecharge);
        }
        case this.carriers[2].key: {
          return this.validateTigo(amountToRecharge) === null ?
            this.updateSelectedValue(amountToRecharge) : this.validateTigo(amountToRecharge);
        }
      }

    }
    return { 'invalid': true };
  }

  updateSelectedValue(amountToRecharge: number) {
    this.updateProgressBarStep2([
      `${this.bdbMask.maskFormatFactory(amountToRecharge, MaskType.CURRENCY)}`,
      `Costo: ${BdbConstants.TRANSACTION_COST.NO_COST}`
    ], true);
  }

  updateProgressBarStep2(details: Array<string>, value: boolean) {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, details);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_3, value);
  }

  validateClaro(amount: number): any {
    if (amount >= 1000 && amount <= 50000) {
      if (amount <= 10000 && amount % 1000 === 0) {
        return null;
      } else if (amount % 10000 === 0) {
        return null;
      } else {
        this.ammtErr =
          'Recuerde que las recargas a este Operador '
          + 'deben ser desde $1.000 a $10.000 en múltiplos de $1.000 y desde $10.000 a $50.000 en múltiplos de $10.000';
        return { 'invalid': true };
      }
    }
    this.ammtErr = 'Recuerde que las recargas a este Operador deben ser desde $1.000 a $10.000 en múltiplos '
      + 'de $1.000 y desde $10.000 a $50.000 en múltiplos de $10.000';
    this.updateProgressBarStep2([], false);
    return { 'invalid': true };
  }

  validateMovistar(amount: number) {
    if (amount >= 1000 && amount <= 50000 && amount % 1000 === 0) {
      return null;
    }
    this.ammtErr = 'Recuerde que las recargas a este Operador deben ser de $1.000 a $50.000 en múltiplos de $1.000';
    this.updateProgressBarStep2([], false);
    return { 'invalid': true };
  }

  validateTigo(amount: number) {
    if (amount >= 500 && amount <= 50000 && amount % 500 === 0) {
      return null;
    }
    this.ammtErr = 'Recuerde que las recargas a este Operador deben ser de $500 a $50.000 en múltiplos de $500';
    this.updateProgressBarStep2([], false);
    return { 'invalid': true };
  }

  onSlideClick(amount: number) {
    // set value to form control in order get the validators
    this.amountForm.patchValue({ amount });
  }

  triggerSelectAcct() {
    this.funnelEvents.callFunnel(this._recharges, this._recharges.steps.amount);
    const rechargeInfo: RechargeInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.RechargeInfo);
    rechargeInfo.amount = this.amountForm.value.amount.toString().replace(/\D+/g, '');
    this.bdbInMemory.setItemByKey(InMemoryKeys.RechargeInfo, rechargeInfo);

    if (this.accessDetail.isOriginSelected()) {
      rechargeInfo.account = this.accessDetail.getOriginSelected();
      this.bdbInMemory.setItemByKey(InMemoryKeys.RechargeInfo, rechargeInfo);
      const loading = this.loading.create();
      this.funnelEvents.callFunnel(this._recharges, this._recharges.steps.confirmation);
      loading.present().then(() => {
        this.rechargeOps.doRecharge(rechargeInfo).subscribe(
          (data: ModalRs) => {
            loading.dismiss();
            this.buildResultData(rechargeInfo, true, data.authCode);
          },
          (ex) => {
            loading.dismiss();
            if (ex.status === 504 || ex.error.errorMessage.toLowerCase().match('timeout')) {
              this.launchInfoPageTimeOut(rechargeInfo);
            } else {
              this.buildResultData(rechargeInfo, false, '', ex.error ? ex.error : null);
            }
          });
      });

    } else {
      this.navCtrl.push('RechargeSelectAccountPage');
    }
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  private launchInfoPageTimeOut(rechargeInfo: RechargeInfo): void {
    this.navCtrl.push('OperationInfoPage', {
      data: {
        amount: Number(rechargeInfo.amount.toString().replace(/\D+/g, '')),
        amountText: 'valor de la recarga',
        bodyText: `El operador no confirma tu recarga; si
                    <span class="pulse-tp-bo3-comp-b"> en las próximas horas no recibes mensaje del operador
                    </span> con la recarga, intenta de nuevo.`,
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

  private buildResultData(
    rechargeInfo: RechargeInfo,
    isSuccess: boolean,
    approvalId: string = '',
    errorData?: ApiGatewayError,
  ): void {
    const state: TransactionResultState = !isSuccess ? 'error' : 'success';
    this.txResultService.launchResultTransfer(this.navCtrl, state, rechargeInfo, approvalId, errorData);
  }
}


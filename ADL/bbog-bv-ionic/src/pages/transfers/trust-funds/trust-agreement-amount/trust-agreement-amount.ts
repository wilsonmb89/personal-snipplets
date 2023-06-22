import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { TrustAgreementInfo } from '../../../../app/models/trust-agreement/trust-agreement-info';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../../../providers/bdb-mask/bdb-mask-type.enum';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { Events } from 'ionic-angular';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { Subscription } from 'rxjs/Subscription';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';

@PageTrack({ title: 'trust-agreement-amount' })
@IonicPage({
  segment: 'fiducia%operation'
})
@Component({
  selector: 'trust-agreement-amount',
  templateUrl: 'trust-agreement-amount.html',
})
export class TrustAgreementAmountPage implements OnInit {

  title = '¿Cuánto quieres transferir?';
  subtitle = 'Esta transacción no tiene costo adicional';
  inv = true;
  abandonText = BdbConstants.ABANDON_TRANS;
  navTitle = 'Fiducias';
  private amountForm: FormGroup;
  private _funnel = this.funnelKeysProvider.getKeys().fiducias;
  private trust: TrustAgreementInfo;
  amountFormSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private progressBar: ProgressBarProvider,
    private bdbMask: BdbMaskProvider,
    private mobileSummary: MobileSummaryProvider,
    private accessDetail: AccessDetailProvider,
    private navigation: NavigationProvider,
    private events: Events,
    private bdbUtils: BdbUtilsProvider
  ) {
    this.amountForm = this.formBuilder.group({
      amount: ['', [Validators.required, this.isValid.bind(this)]],
      choice: new FormControl('investment'),
    }, { validator: this.fiduSumaAmmountValidator.bind(this) });
  }

  fiduSumaAmmountValidator(control: FormGroup) {
    if (!!this.trust) {
      const amountSignal = control.get('amount').value;
      const amount = parseInt(CurrencyFormatPipe.unFormat(amountSignal), 10);
      const choice = control.get('choice').value;
      const initialValue = this.trust.agreement.amount;
      const typeProduct = this.trust.agreement.productName.toUpperCase().includes('SUMAR');
      const isValid = (typeProduct && amount < 30000 && choice === 'investment' && +initialValue === 0);
      return { 'amountFiduSummaInvalid': isValid };

    }
    return;
  }

  ngOnInit() {

    if (this.bdbUtils.validateBusinessDay()) {
      this.onChanges();
    } else {
      this.onAbandonClicked();
    }
  }

  ionViewWillEnter() {
    this.events.publish('srink', true);
    this.trust = this.bdbInMemory.getItemByKey(InMemoryKeys.TrustAgreementInfo);
    this.trust = (!!this.trust) ? this.trust : new TrustAgreementInfo();
    const product = this.accessDetail.getDestinationSelected() || this.accessDetail.getOriginSelected();
    if (!!product) {

      if (product.productDetailApi.productBankType ===  BdbConstants.FUDUCIARY) {
        this.trust.agreement = product;
      } else {
        this.trust.account = product;
      }

      this.bdbInMemory.setItemByKey(InMemoryKeys.TrustAgreementInfo, this.trust);
    }
    this.setUpProgressBar(this.trust);
    this.updateMobileSummary();

    if (this.trust.agreement.disinvest) {
      this.amountForm.get('choice').setValue('divestment');
      this.setDisinvest();
    }
    this.accessDetail.unselectedDestination();
    this.bindFormChanges();
  }

  ionViewWillLeave(): void {
    if (!!this.amountFormSubscription) {
      this.amountFormSubscription.unsubscribe();
    }
  }

  updateMobileSummary() {
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);
  }

  setDisinvest() {
    this.inv = false;
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Origen');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Destino');
  }

  setUpProgressBar(trust: TrustAgreementInfo) {
    this.progressBar.init(
      '',
      BdbConstants.PROGBAR_STEP_1,
      'Destino',
      [trust.agreement.productName,
      `Disponible: ${this.bdbMask.maskFormatFactory(trust.agreement.balanceDetail['disponibleBBOG'], MaskType.CURRENCY)}`],
      { isDone: true, pathLogo: BdbConstants.BBOG_LOGO_WHITE });
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor a transferir');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Origen');
    this.summaryFromSessionStorage();
  }

  isValid(control: FormControl) {
    if (control.value !== undefined && this !== undefined) {
      const amount = control.value.toString().replace(/\D+/g, '');
      const amountToTransfer: number = +amount;
      if (amountToTransfer > 0) {
        return null;
      }
    }
    return { 'invalid': true };
  }

  onChanges(): void {
    this.amountForm.get('choice').valueChanges.subscribe(val => {
      switch (val) {
        case 'investment': {
          this.inv = true;
          this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Destino');
          this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Origen');
          break;
        }
        case 'divestment': {
          this.setDisinvest();
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  continue() {
    this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.amount);
    const trust: TrustAgreementInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TrustAgreementInfo);
    trust.amount = this.amountForm.value.amount.toString().replace(/\D+/g, '');
    trust.operation = this.amountForm.value.choice;
    this.callOperationFunnel(trust.operation);
    this.bdbInMemory.setItemByKey(InMemoryKeys.TrustAgreementInfo, trust);
    this.navCtrl.push('TrustAgreementTransferPage');
  }

  private callOperationFunnel(operation: string) {
    if (operation === 'investment') {
      this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.investment);
    } else {
      this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.divestment);
    }
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navigation.abandonTransaction(this.navCtrl);
  }

  private summaryFromSessionStorage(): void {
    const trust = this.bdbInMemory.getItemByKey(InMemoryKeys.TrustAgreementInfo);
    if (!!trust && !!trust.amount) {
      const amount = this.bdbMask.maskFormatFactory(trust.amount, MaskType.CURRENCY);
      this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [amount, 'Costo: $ 0']);
      this.amountForm.get('amount').setValue(trust.amount);
    }
  }

  private bindFormChanges(): void {
    this.amountFormSubscription = this.amountForm.valueChanges.subscribe(changes => {
      const amount = changes.amount;
      this.progressBar.setDetails(
        BdbConstants.PROGBAR_STEP_2,
        !!amount ? [
          amount,
          'Costo: $ 0'
        ] : []
      );
    });
  }
}

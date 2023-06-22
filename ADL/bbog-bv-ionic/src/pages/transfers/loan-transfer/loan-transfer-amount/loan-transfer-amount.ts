import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { LoanTransferInfo } from '../../../../app/models/loan-transfer/loan-transfer-info';
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
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';
import { Subscription } from 'rxjs/Subscription';
import { NonZeroAmtValidator } from '../../../../validators/minAmmt';

@PageTrack({ title: 'page-loan-transfer-amount' })
@IonicPage({
  segment: 'loan-amount'
})
@Component({
  selector: 'page-loan-transfer-amount',
  templateUrl: 'loan-transfer-amount.html',
})
export class LoanTransferAmountPage {

  title: string;
  subtitle: string;
  amountForm: FormGroup;
  navTitle = 'Uso de Crédito';
  abandonText = BdbConstants.ABANDON_TRANS;
  private _funnel = this.funnelKeys.getKeys().loanTransfer;
  amountFormSubscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private progressBar: ProgressBarProvider,
    private bdbMask: BdbMaskProvider,
    private funnelEvents: FunnelEventsProvider,
    private funnelKeys: FunnelKeysProvider,
    private accessDetail: AccessDetailProvider,
    private navigation: NavigationProvider,
    private events: Events
  ) {
    this.title = '¿Cuánto quieres transferir?';
    this.subtitle = 'Esta transacción no tiene costo adicional';
    this.amountForm = this.formBuilder.group({
      amount: ['', [Validators.required, NonZeroAmtValidator.isValid]]
    });
    this.events.publish('srink', true);
  }

  ionViewWillEnter() {
    let loanTransfer: LoanTransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanTransferInfo);

    if (this.accessDetail.isOriginSelected()) {
      loanTransfer = new LoanTransferInfo();
      loanTransfer.loan = this.accessDetail.getOriginSelected();
      this.bdbInMemory.setItemByKey(InMemoryKeys.LoanTransferInfo, loanTransfer);
      this.accessDetail.unselectedOrigin();
    }

    this.setUpProgressBar(loanTransfer);
    this.bindFormChanges();
  }

  ionViewWillLeave(): void {
    if (!!this.amountFormSubscription) {
      this.amountFormSubscription.unsubscribe();
    }
  }

  private setUpProgressBar(loanTransfer: LoanTransferInfo): void {
    this.progressBar.resetObject();
    this.progressBar.setLogo(BdbConstants.BBOG_LOGO_WHITE);
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Origen');
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [loanTransfer.loan.productName,
      `Disponible: ${this.bdbMask.maskFormatFactory(loanTransfer.loan.balanceDetail.cupoDispoCreSerBBOG, MaskType.CURRENCY)}`]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);

    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor a transferir');
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, null);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, false);

    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Destino');
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, null);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_3, false);

    this.summaryFromSessionStorage();
  }

  continue() {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.amount);
    const loanTransfer: LoanTransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanTransferInfo);
    loanTransfer.amount = CurrencyFormatPipe.unFormat(this.amountForm.value.amount);
    this.bdbInMemory.setItemByKey(InMemoryKeys.LoanTransferInfo, loanTransfer);
    this.navCtrl.push('LoanTransferTransferPage');
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navigation.abandonTransaction(this.navCtrl);
  }

  private summaryFromSessionStorage(): void {
    const loanTransfer: LoanTransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanTransferInfo);
    if (!!loanTransfer && !!loanTransfer.amount) {
      const amount = this.bdbMask.maskFormatFactory(loanTransfer.amount, MaskType.CURRENCY).replace(',00', '');
      this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [amount, 'Costo: $ 0']);
      this.amountForm.get('amount').setValue(loanTransfer.amount);
    }
  }

  private bindFormChanges(): void {
    this.amountFormSubscription = this.amountForm.valueChanges.subscribe(changes => {
      const amount = changes.amount;
      this.progressBar.setDetails(
        BdbConstants.PROGBAR_STEP_2,
        !!amount ? [amount, 'Costo: $ 0'] : []
      );
    });
  }
}

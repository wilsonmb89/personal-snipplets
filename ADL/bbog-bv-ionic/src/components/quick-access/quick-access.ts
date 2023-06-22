import { Component, Input, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { BdbShortcutCard } from '../../app/models/bdb-shortcut-card';
import { BillPaymentInfo } from '../../app/models/bills/bill-payment-info';
import { AccountAny } from '../../app/models/enrolled-transfer/account-any';
import { TransferInfo } from '../../app/models/transfers/transfer-info';
import { BdbUtilsProvider } from '../../providers/bdb-utils/bdb-utils';
import { FunnelEventsProvider } from '../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../providers/funnel-keys/funnel-keys';
import { ProgressBarProvider } from '../../providers/progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { TooltipOpsProvider } from '../../providers/tooltip-ops/tooltip-ops';
import { TokenOtpProvider } from '../../providers/token-otp/token-otp/token-otp';
import { BdbModalProvider } from '../../providers/bdb-modal/bdb-modal';


@Component({
  selector: 'quick-access',
  templateUrl: 'quick-access.html'
})
export class QuickAccessComponent {

  @Input()
  title = 'Paga, transfiere y recarga';
  private _funnel = this.funnelKeys.getKeys().quickAccess;

  @Input() pendingBills$: Array<BdbShortcutCard>;
  @Input() loadingBills$ = true;
  @Input() completedBills$ = false;
  @Input() enrolledAccts: Array<BdbShortcutCard>;
  @Input() loadingAccts = true;
  @Input() showAddRecgarge = true;
  @Input() showAddAcct = true;
  @Input() shorcutAddMode;

  addAccount = 'Inscribir una cuenta';
  addBill = 'Agregar una factura';
  addRecharge = 'Recargar un celular';

  private _funnelEnroll = this.funnelKeys.getKeys().enrolleBills;

  constructor(
    private navCtrl: NavController,
    public events: Events,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvent: FunnelEventsProvider,
    private bdbUtils: BdbUtilsProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private progressBar: ProgressBarProvider,
    private tokenOtp: TokenOtpProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private tooltipOps: TooltipOpsProvider,
    private bdbModal: BdbModalProvider
  ) { }

  getColor(index: number): string {
    return this.bdbUtils.getRandomColor(index);
  }

  payBill(event: BdbShortcutCard) {
    this.funnelEvent.callFunnel(this._funnel, this._funnel.steps.bills);
    this.bdbInMemory.setItemByKey(InMemoryKeys.PaymentOrigin, 'bills');
    const billPaymentInfo: BillPaymentInfo = new BillPaymentInfo();
    billPaymentInfo.bill = event.object;
    billPaymentInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    this.bdbInMemory.setItemByKey(InMemoryKeys.BillPaymentInfo, billPaymentInfo);
    this.navCtrl.push('BillSelectPaymentPage');
  }

  handleClick(event: BdbShortcutCard) {
    this.funnelEvent.callFunnel(this._funnel, this._funnel.steps.transfer);
    const accountAny: AccountAny = new AccountAny(false, null, event.object);
    const transferInfo: TransferInfo = new TransferInfo();
    transferInfo.accountTo = accountAny;
    if (accountAny.owned || accountAny.accountEnrolled.aval) {
      transferInfo.isAval = true;
      transferInfo.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    } else {
      transferInfo.isAval = false;
      transferInfo.transactionCost = BdbConstants.TRANSACTION_COST.ACH_TRANSFER;
    }
    this.bdbInMemory.setItemByKey(InMemoryKeys.TransferInfo, transferInfo);
    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Transferencia');
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor a transferir');
    this.navCtrl.push('amount%input');
  }

  callAddBill(e) {
    this.funnelEvent.callFunnel(this._funnelEnroll, this._funnelEnroll.steps.pickEnroll);
    this.tooltipOps.removeAllTooltip();
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
        this.navCtrl.push('suscribe%bill%name');
      },
      'billInscription');
  }

  callAddAcct(e) {
    this.funnelEvent.callFunnel(this._funnelEnroll, this._funnelEnroll.steps.pickEnroll);
    this.bdbInMemory.setItemByKey(InMemoryKeys.PaymentOrigin, 'transfer');
    this.tooltipOps.removeAllTooltip();
    this.tokenOtp.requestToken(
      this.viewRef,
      this.resolver,
      () => {
          this.navCtrl.push('subscribe%acct%data');
      },
      'accountInscription');
  }

  callAddRecharge(e) {
    this.navCtrl.push('PaymentsMainPage', {
      tab: 'recharge'
    }, {
      animate: true,
      animation: 'ios-transition',
      direction: 'forward'
    });
  }

  get validateAddAcct() {
    if (!this.showAddAcct || this.loadingAccts || !this.enrolledAccts || this.enrolledAccts.length > 0) {
      return false;
    }
    return true;
  }

  get validateRecharges() {
    if (!this.showAddRecgarge || this.loadingAccts) {
      return false;
    }
    return true;
  }

}

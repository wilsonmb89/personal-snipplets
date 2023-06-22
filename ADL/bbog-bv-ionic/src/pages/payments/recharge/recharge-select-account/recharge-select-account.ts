import { Component } from '@angular/core';
import { App, Events, IonicPage, LoadingController, NavController } from 'ionic-angular';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { ModalRs } from '../../../../app/models/modal-rs/modal-rs';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { RechargeInfo } from '../../../../app/models/recharges/recharge-info';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { MaskType } from '../../../../providers/bdb-mask/bdb-mask-type.enum';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { RechargeOpsProvider } from '../../../../providers/recharge-ops/recharge-ops';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { TrxResultRechargeService } from '@app/shared/modules/transaction-result/services/payments/transaction-result-recharge.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';

@IonicPage()
@Component({
  selector: 'page-recharge-select-account',
  templateUrl: 'recharge-select-account.html',
})
export class RechargeSelectAccountPage {

  items: Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> = [];
  accounts: Array<ProductDetail>;
  subtitle: string;
  msgButton: string;
  transactionCost: string;
  navTitle = 'Recargas';
  enable = false;
  abandonText = BdbConstants.ABANDON_PAY;

  private _funnel = this.funnelKeys.getKeys().recharges;

  constructor(
    public navCtrl: NavController,
    public appCtrl: App,
    public event: Events,
    private bdbInMemory: BdbInMemoryProvider,
    private selectAccountHandler: SelectAccountHandlerProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private bdbMask: BdbMaskProvider,
    private loading: LoadingController,
    private navigation: NavigationProvider,
    private mobileSummary: MobileSummaryProvider,
    private progressBar: ProgressBarProvider,
    private rechargeOps: RechargeOpsProvider,
    private txResultService: TrxResultRechargeService,
  ) {
    this.subtitle = 'Vas a pagar con:';
    this.msgButton = 'Confirmar recarga';
  }

  ionViewWillEnter() {
    this.accounts = this.selectAccountHandler.getAccountsAvailable(true);
    this.items = this.selectAccountHandler.getCardsMapping(this.accounts);
    const rechargeInfo: RechargeInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.RechargeInfo);
    this.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
    const mAccount: ProductDetail = this.selectAccountHandler.setFirstAccountSelection(this.accounts, this._funnel);
    if (mAccount !== null) {
      // add to model
      this.enable = true;
      rechargeInfo.account = mAccount;
      this.bdbInMemory.setItemByKey(InMemoryKeys.RechargeInfo, rechargeInfo);
    }
    this.updateMobileSummary(rechargeInfo.amount);
    this.updateAmountProgressBar(rechargeInfo.amount, this.transactionCost);
  }

  updateAmountProgressBar(amount, transactionCost) {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, [
      this.bdbMask.maskFormatFactory(amount, MaskType.CURRENCY),
      `Costo: ${BdbConstants.TRANSACTION_COST.NO_COST}`
    ]);
  }

  paymentSelected(item) {
    this.enable = true;
    this.items.forEach((e) => {
      e.isActive = false;
    });
    this.selectAccountHandler.paymentSelected(item, this._funnel, BdbConstants.PROGBAR_STEP_4);
    // add to model
    const rechargeInfo: RechargeInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.RechargeInfo);
    rechargeInfo.account = item.acct;
    this.bdbInMemory.setItemByKey(InMemoryKeys.RechargeInfo, rechargeInfo);
  }

  send() {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.confirmation);
    const rechargeInfo: RechargeInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.RechargeInfo);

    const loading = this.loading.create();
    loading.present();

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
      }
    );
  }


  private launchInfoPageTimeOut(rechargeInfo: RechargeInfo): void {
    this.navCtrl.push('OperationInfoPage', {
      data: {
        amount: Number(rechargeInfo.amount),
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

  updateMobileSummary(ammount) {
    this.mobileSummary.setHeader(null);
    this.mobileSummary.setBody(null);
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }
  onAbandonClicked() {
    this.navCtrl.popToRoot();
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

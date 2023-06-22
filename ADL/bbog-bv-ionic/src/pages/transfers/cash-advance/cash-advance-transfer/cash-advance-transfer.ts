import { Component } from '@angular/core';
import { CreditCardAdvanceDelegateService } from '@app/delegate/internal-transfer-delegate/credit-card-advance-delegate.service';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { map, take } from 'rxjs/operators';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { CashAdvanceInfo } from '../../../../app/models/cash-advance/cash-advance-info';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';

@PageTrack({ title: 'page-cash-advance-transfer' })
@IonicPage()
@Component({
  selector: 'page-cash-advance-transfer',
  templateUrl: 'cash-advance-transfer.html',
})
export class CashAdvanceTransferPage {

  items: Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> = [];
  accounts: Array<ProductDetail> = [];
  subtitle: string;
  msgButton: string;
  navTitle = 'Avances';
  enable = false;
  abandonText = BdbConstants.ABANDON_TRANS;
  private _funnel = this.funnelKeys.getKeys().cashAdvance;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private loading: LoadingController,
    private selectAccountHandler: SelectAccountHandlerProvider,
    private navigation: NavigationProvider,
    private bdbModal: BdbModalProvider,
    private creditCardAdvanceService: CreditCardAdvanceDelegateService,
    private userFacade: UserFacade,
  ) {
    this.subtitle = 'Selecciona la cuenta de destino';
    this.msgButton = 'Confirmar avance';
  }

  ionViewWillEnter() {
    const cashInfo: CashAdvanceInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CashAdvanceInfo);
    this.accounts = this.selectAccountHandler.getAccountsAvailable(false);
    this.items = this.selectAccountHandler.getCardsMapping(this.accounts);
    const mAccount: ProductDetail = this.selectAccountHandler.setFirstAccountSelection(this.accounts, this._funnel);
    if (mAccount !== null) {
      // add to model
      this.enable = true;
      cashInfo.account = mAccount;
      this.bdbInMemory.setItemByKey(InMemoryKeys.CashAdvanceInfo, cashInfo);
    }
    this.userFacade.transactionCostByType$('CASH_ADVANCE').pipe(
      take(1),
      map(catalogueCost => !!catalogueCost ? catalogueCost : 'NO_AVAILABLE')
    ).subscribe(cost => this.selectAccountHandler.updateAmountProgressBar(cashInfo.amount, cost));
  }

  paymentSelected(item: { cardTitle, cardLabel, cardValue, isActive, acct }) {
    this.enable = true;
    this.items.forEach((e) => {
      e.isActive = false;
    });
    this.selectAccountHandler.paymentSelected(item, this._funnel);
    // add to model
    const cashInfo: CashAdvanceInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CashAdvanceInfo);
    cashInfo.account = item.acct;
    this.bdbInMemory.setItemByKey(InMemoryKeys.CashAdvanceInfo, cashInfo);
  }

  send() {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.more);
    this.operateAdvance();
  }

  operateAdvance(pin?: string) {
    const cashInfo: CashAdvanceInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.CashAdvanceInfo);
    this.creditCardAdvanceService.sendCashAdvance(cashInfo, pin, this.loading, this.navCtrl);
  }

  showPinModal() {
    const iconPath = 'assets/imgs/cash-advance-icon.svg';
    const modalData = {
      iconPath,
      title: 'Clave de Avances',
      text: 'Para realizar este proceso, ingresa la clave de avances de la Tarjeta de Crédito.'
    };
    this.bdbModal.launchPinModal(modalData, (data) => {
      if (data) {
        this.operateAdvance(data);
      }
    });
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navigation.abandonTransaction(this.navCtrl);
  }
}

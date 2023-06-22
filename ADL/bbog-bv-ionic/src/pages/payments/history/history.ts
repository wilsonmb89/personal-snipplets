import {Component, ViewChild, OnInit, Input} from '@angular/core';
import {App, IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {ColumnOptionsDynamic} from '../../../app/models/column-options-dynamic';
import {HistoryTxProvider} from '../../../providers/history-tx/history-tx';
import {HistoryTxRq, Balance} from '../../../app/models/history-tx/history-tx-rq';
import {HistoryTxDwnRq} from '../../../app/models/history-tx/history-tx-dwn-rq';
import {BdbUtilsProvider} from '../../../providers/bdb-utils/bdb-utils';
import {BdbInMemoryProvider} from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import {InMemoryKeys} from '../../../providers/storage/in-memory.keys';
import {SessionProvider} from '../../../providers/authenticator/session';
import {BdbMap} from '../../../app/models/bdb-generics/bdb-map';
import {DatePipe} from '@angular/common';
import {map} from 'rxjs/operators';
import {NavigationProvider} from '../../../providers/navigation/navigation';
import {PageTrack} from '../../../app/core/decorators/AnalyticTrack';
import {Tab} from '../../../components/bdb-tabs/model/tab';
import {BdbMaskProvider} from '../../../providers/bdb-mask/bdb-mask';
import {MaskType} from '../../../providers/bdb-mask/bdb-mask-type.enum';
import {IdType} from '../../../providers/bdb-utils/id-type.enum';
import {EncryptionIdType} from '../../../providers/bdb-utils/encryption-id.enum';
import {BdbPlatformsProvider} from '../../../providers/bdb-platforms/bdb-platforms';
import {BdBExcelProvider} from '../../../providers/bdb-excel/bdb-excel';
import {BdbConstants} from '../../../app/models/bdb-generics/bdb-constants';
import {ProductDetail} from '../../../app/models/products/product-model';
import {AccountBalance} from '../../../app/models/enrolled-transfer/account-balance';
import { TxHistoryModel, AccountTo, AccountFrom, OrderInfo } from '@app/shared/modules/transaction-result/models/transaction-result-history.model';
import { TrxResultHistoryService } from '@app/shared/modules/transaction-result/services/history/transaction-result-history.service';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { PRODUCTS_CONST } from '@app/shared/utils/bdb-constants/products-constants';

@PageTrack({title: 'history'})
@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage implements OnInit {

  showTransactionsLoader = false;
  showTransactionsError = false;
  transactionsErrorMsg = '';
  quickSelect = false;
  datePicker = true;
  minDate: Date;
  tabs: Tab[];
  columns: ColumnOptionsDynamic[] = [];
  title = 'Historico';
  @Input() type: string;
  dataSource: any[] = [];
  tabsDisabled = false;
  contextMenuList: any;
  tempInit: number;
  tempEnd: number;

  @ViewChild('historyWeb') historyWeb: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private historyTxProvider: HistoryTxProvider,
    private bdbUtils: BdbUtilsProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private datePipe: DatePipe,
    private navigation: NavigationProvider,
    private bdbMask: BdbMaskProvider,
    private bdbPlatforms: BdbPlatformsProvider,
    private popoverCtrl: PopoverController,
    private bdbExcel: BdBExcelProvider,
    public appCtrl: App,
    private txResultService: TrxResultHistoryService,
  ) {
  }

  ngOnInit() {

    if (this.navParams.data.type || this.type) {
      this.buildTypeHistory(this.navParams.data.type || this.type);
    } else {
      this.navCtrl.push('MasterPage');
      return;
    }

    this.contextMenuList = this.setContextMenuList();
    this.tempInit = this.tempEnd = 0;
    this.tabs = this.getTabs();
    this.initCall();
  }

  private buildTypeHistory(type) {
    const dataTemp = this.historyTxProvider.buildHistoryTable(type);
    this.columns = dataTemp.columns;
    this.title = dataTemp.title;
    this.type = dataTemp.type;
  }

  private initCall() {

    const nowDate = new Date();
    this.getHistoryTx(this.getDateInit(nowDate), nowDate.getTime());
    this.minDateFilter();
  }

  private minDateFilter() {
    const nowDate = new Date();
    nowDate.setMonth(nowDate.getMonth() - 6);
    this.minDate = nowDate;
  }

  private buildRq(init: number, end: number): HistoryTxRq {
    const history: HistoryTxRq = new HistoryTxRq();
    history.customer = this.bdbUtils.getCustomer(IdType.BUS_BDB, EncryptionIdType.FULL);
    const balance: Balance = new Balance();
    balance.type = this.type;
    balance.initDate = new Date(init).toISOString().split('T')[0];
    balance.endDate = new Date(end).toISOString().split('T')[0];
    history.balance = balance;
    history.ipAddr = this.bdbInMemory.getItemByKey(InMemoryKeys.IP);
    return history;

  }

  private getHistoryTx(init: number, end: number) {
    this.tabsDisabled = true;
    this.dataSource = [];
    this.showTransactionsError = false;
    this.showTransactionsLoader = true;
    this.historyTxProvider.geHistoryByDate(this.buildRq(init, end))
      .pipe(
        map((a: any) => a.transfPmtInfo),
      ).subscribe(data => {
        if (data.length < 1) {
          this.transactionsErrorMsg = 'No se registran movimientos.';
        } else {
          this.dataSource = data.sort((d1, d2) => {
            return (new Date(d2.orderInfo.expDt).getTime()) - (new Date(d1.orderInfo.expDt).getTime());
          });
        }
        this.showTransactionsError = false;
        this.showTransactionsLoader = false;
        this.tabsDisabled = false;

      },
      e => {
        this.transactionsErrorMsg = (e.status === 409 && e.error.businessErrorCode === '1120')
          ? 'No se registran movimientos.'
          : 'Hubo un error al cargar tus movimientos.';
        this.showTransactionsLoader = false;
        this.showTransactionsError = true;
        this.tabsDisabled = false;
      }
    );
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onLogout() {
    this.navCtrl.push('authentication/logout');
  }

  onDataRangeClicked(date: Array<BdbMap>) {
    const startDt = date.find((e) => e.key === 'startDt').value;
    const endDt = date.find((e) => e.key === 'endDt').value;
    if (startDt === endDt) {

    }
    this.tempInit = new Date(startDt).getTime();
    this.tempEnd = new Date(endDt).getTime();
    this.getHistoryTx(this.tempInit, this.tempEnd);
  }

  onSelectClicked(d) {
  }

  private getDateInit(dateActual: Date): number {
    const initDate = new Date(dateActual.getFullYear(), dateActual.getMonth() - 1, 1);
    return initDate.getTime();
  }

  exportData(event) {
    if (this.bdbPlatforms.isMobile()) {
      this.historyTxProvider.exportData(this.dataSource, this.columns);
    } else {
      this.openContextMenu(event);
    }
  }

  openContextMenu(myEvent) {
    const popover = this.popoverCtrl.create('ContextMenuPage', {data: this.contextMenuList, showContextArrow: false}, {
      cssClass: 'contextPopOver'
    });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss((data: any) => {
      if (!!data && !!data.event && !!data.event.key) {
        switch (data.event.key) {
          case 'csv':
            this.historyTxProvider.exportData(this.dataSource, this.columns);
            break;
          case 'excel':
            this.getTrxFile(this.type);
            break;
        }
      }
    });
  }

  getTrxFile(typeHst: string) {
    const trxFileRq = new HistoryTxDwnRq();
    trxFileRq.typeFile = this.getTxType(typeHst);
    trxFileRq.reportData = this.historyTxProvider.getCSVData(this.dataSource, this.columns);
    this.bdbExcel.callExcelFileService(trxFileRq);
  }

  public changeTab(tab: Tab): void {
    this.type = tab.value;
    this.historyWeb.searchFilter.refreshDate();
    this.historyWeb.searchFilterMobile.refreshDate();
    this.initCall();
  }

  getTabs(): Tab[] {
    return [
      {'name': 'Servicios', 'status': true, 'value': '1'},
      {'name': 'Obligaciones', 'status': false, 'value': '2'},
    ];
  }

  getTxType(typeHst: string): string {
    if (typeHst === '3') {
      return BdbConstants.TRANSFERS_HISTORY.label;
    } else {
      return BdbConstants.PAYMENTS_BILLS_HISTORY.label;
    }
  }

  public viewVoucher(e: any): void {
    const txData = JSON.parse(JSON.stringify(e));
    this.buildTransactionData(txData);
  }

  private buildTransactionData(txHistoryModel: TxHistoryModel) {
    txHistoryModel.accountFrom.acctType = this.buildAccountFromData(txHistoryModel.accountFrom);
    if (!!txHistoryModel.accountTo) {
      txHistoryModel.accountTo.acctType = this.buildAccountToData(txHistoryModel.accountTo, txHistoryModel.orderInfo);
    } else {
      txHistoryModel.accountTo = {
        acctId: '',
        acctKey: '',
        acctType: '',
        bankInfo: {
          bankId: '',
          branchId: '',
          name: ''
        }
      };
      switch (this.type) {
        case (BdbConstants.PAYMENTS_BILLS_HISTORY.value):
          txHistoryModel.accountTo.acctType = txHistoryModel.orderInfo.paymentConcept;
          break;
        case (BdbConstants.PAYMENTS_OBLIGATIONS_HISTORY.value):
          txHistoryModel.accountTo.acctType =
            `Tarjeta de Crédito|${txHistoryModel.orderInfo.paymentConcept.replace('Pago Tarjeta Crédito ', 'No. ****')}`;
          break;
      }
    }
    txHistoryModel.orderInfo.transactionCost = this.type === BdbConstants.TRANSFERS_HISTORY.value ? '' : 'Gratis';
    const approvalId = txHistoryModel.orderInfo.numAuthTrn;
    const txState: TransactionResultState = !txHistoryModel.orderInfo.desc.toUpperCase().includes('NO EXITOSO') ? 'success' : 'error';
    this.txResultService.launchResultTransfer(this.navCtrl, txState, txHistoryModel, approvalId, this.type);
  }

  private buildAccountFromData(accountFrom: AccountFrom): string {
    const accountDetailFrom: AccountBalance | ProductDetail = this.getDataAccount(accountFrom.acctType);
    if (!!accountDetailFrom) {
      return `${accountDetailFrom.productName} No. ${this.maskField(accountDetailFrom.productNumber)}`;
    } else {
      return `${PRODUCTS_CONST.accountNames[accountFrom.acctKey || '']} No. ${this.maskField(accountFrom.acctId)}`;
    }
  }

  private buildAccountToData(accountTo: AccountTo, orderInfo: OrderInfo): string {
    switch (this.type) {
      case (BdbConstants.TRANSFERS_HISTORY.value):
        const accountDetailTo: AccountBalance | ProductDetail = this.getDataAccount(accountTo.acctType);
        if (!!accountDetailTo) {
          return `${accountDetailTo.productName} No. ${this.maskField(accountDetailTo.productNumber)}`;
        }
        return accountTo.acctType;
      case (BdbConstants.PAYMENTS_BILLS_HISTORY.value):
        return orderInfo.paymentConcept;
      case (BdbConstants.PAYMENTS_OBLIGATIONS_HISTORY.value):
        return `Tarjeta de Crédito|${orderInfo.paymentConcept.replace('Pago Tarjeta Crédito ', 'No. ****')}`;
      default:
        return accountTo.acctType;
    }
  }

  validateDateMobile() {
    return (i: any, data: any, dataSource: any) => {
      if (i === 0 || i > 0 && data.orderInfo.expDt !== dataSource[i - 1].orderInfo.expDt) {
        return this.bdbMask.maskFormatFactory(data.orderInfo.expDt, MaskType.DATE);
      }
      return false;
    };
  }

  setContextMenuList() {
    return [
      {
        key: 'excel',
        value: 'Excel',
        color: 'blue-white-card'
      },
      {
        key: 'csv',
        value: '.csv',
        color: 'blue-white-card'
      }
    ];
  }

  private getDataAccount(targetAcctType: string): AccountBalance | ProductDetail {

    const enrAcct: AccountBalance[] = this.bdbInMemory.getItemByKey(InMemoryKeys.EnrolledAccountsList);
    const customerProducts: ProductDetail[] = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    if (!!enrAcct) {
      const accountTo = enrAcct.find(a => targetAcctType.endsWith(a.productNumber.trim().replace(/^0+/, '')));
      if (!!accountTo) {
        return accountTo;
      }
    }
    if (!!customerProducts) {
      const accountTo = customerProducts.find(a => targetAcctType.endsWith(a.productNumber.trim().replace(/^0+/, '')));
      if (!!accountTo) {
        return accountTo;
      }
    }
    return null;
  }

  public maskField(field: string): string {
    return `*****${field.substr(field.length - 4)}`;
  }

}

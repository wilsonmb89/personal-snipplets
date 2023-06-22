import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, ComponentFactoryResolver, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Content, Events, IonicPage, LoadingController, NavController, PopoverController, } from 'ionic-angular';
import { PageTrack } from '../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { BdbGenericTableColumn, BdbGenericTableExpandable, } from '../../app/models/generic-table/bdb-generic-table';
import { mapDetailsBalance, ProductDetail, } from '../../app/models/products/product-model';
import { TransactionEvent } from '../../app/models/transactions/transaction-event';
import { TransactionsDate } from '../../app/models/transactions/transactions-date';
import { Transaction } from '../../app/models/transactions/transactions-model';
import { BdbCardDetailModel } from '../../components/core/molecules/bdb-card-detail';
import { AvalOpsProvider } from '../../providers/aval-ops/aval-ops';
import { GetBalancesByAccountRs } from '../../providers/aval-ops/aval-ops-models';
import { BdbPdfProvider } from '../../providers/bdb-pdf/bdb-pdf';
import { BdbUtilsProvider } from '../../providers/bdb-utils/bdb-utils';
import { CardsMapperProvider } from '../../providers/cards-mapper/cards-mapper';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { TableConfigProvider } from '../../providers/table-config/table-config';
import { TransactionsProvider } from '../../providers/transactions/transactions';
import { TransactionsResponseFiduciary } from '../../app/models/fiducia/transaction-response-fiduciary';
import { DataMovementsFiduciary } from '../../app/models/fiducia/data-movements-fiduciary';
import { Amount } from '../../app/models/amount';
import { BdbPlatformsProvider } from '../../providers/bdb-platforms/bdb-platforms';
import { HistoryTxDwnRq } from '../../app/models/history-tx/history-tx-dwn-rq';
import { BdBExcelProvider } from '../../providers/bdb-excel/bdb-excel';
import { take } from 'rxjs/operators';
import { BdbModalProvider } from '../../providers/bdb-modal/bdb-modal';
import { Observable } from 'rxjs/Observable';
import { ModalFilterComponent } from '@app/shared/components/modals/modal-filter/modal-filter';
import { BdbMaskProvider, MaskType } from '../../providers/bdb-mask';
import { PulseModalControllerProvider } from '../../providers/pulse-modal-controller/pulse-modal-controller';
import { UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import { TransactionHistoryDelegateService } from '@app/delegate/transaction-history/transaction-history-delegate.service';
import { GetAllBasicDataDelegateService } from '@app/delegate/customer-basic-data-delegate/get-all-delegate.service';
import { CreditCardBlockingService } from '@app/modules/products/services/credit-card-blocking.service';
import { CreditCardFacade } from '@app/shared/store/products/facades/credit-card.facade';
import { CreditCardActivationRq } from '@app/apis/customer-security/models/creditCardActivation';
import { Subscription } from 'rxjs/Subscription';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { PulseToastService } from '@app/shared/components/pulse-toast/provider/pulse-toast.service';
import { CardsInfoFacade } from '@app/modules/settings/store/facades/cards-info.facade';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { UserFeatures } from '@app/apis/user-features/models/UserFeatures';

export interface TagData {
  text: string;
  value: string;
}

@PageTrack({ title: 'page-detail-and-txhistory' })
@IonicPage()
@Component({
  selector: 'page-detail-and-txhistory',
  templateUrl: 'detail-and-txhistory.html'
})
export class DetailAndTxhistoryPage {
  @ViewChild('header') hh: ElementRef;
  @ViewChild('master') hm: ElementRef;
  @ViewChild('txtable') ht: ElementRef;
  @ViewChild('fixi') hi: ElementRef;
  @ViewChild(Content) contentMain: Content;

  divHeight = 0;
  cardData: BdbCardDetailModel;
  updateLayout = false;
  productDetail: ProductDetail;
  transactionsLoaded: TransactionsDate[] = [];
  transactionsWeb: Transaction[] = [];
  transacionEvent: TransactionEvent;
  showTransactionsLoader = false;
  showTransactionsError = false;
  showDetailError = false;
  showLoaderDetail = false;
  private startDt: string;
  private endDt: string;
  applyHistory = true;
  notApplyHistory = {
    text: this.messageNoTxHistoryFB(
      this.bdbInMemory.getItemByKey(InMemoryKeys.ProductDetail)
    ),
    img: {
      desktop: 'not-apply-history-desktop.svg',
      mobile: 'not-apply-history-mobile.svg',
    },
  };
  minDate: Date;
  columns: Array<BdbGenericTableColumn> = [];
  expandable: Array<BdbGenericTableExpandable> = [];
  isShrinkCard: any;
  contextMenuList: any;
  showTable = true;
  cdt$: Observable<any>;
  textAssetsFiduciary: any;
  showPlusSymbol = false;
  showErrorFiduciary = false;
  showFiduciaryDetails = false;
  tagdata: TagData[] = [];
  newSelectedDate: string [];
  private creditCardSubscription: Subscription;
  showBlockedCreditCardInfo = false;
  descriptionLockCard: string;
  lockCreditCard = false;
  frozenTag = false;
  showRequestCardButton = false;
  shareAccountInfo = false;

  constructor(
    private cardsMapper: CardsMapperProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private transactions: TransactionsProvider,
    private bdbUtils: BdbUtilsProvider,
    private navCtrl: NavController,
    private dateFormat: DatePipe,
    private pdfProvider: BdbPdfProvider,
    private tableConfig: TableConfigProvider,
    public cp: CurrencyPipe,
    private avalOps: AvalOpsProvider,
    private events: Events,
    private bdbPlatforms: BdbPlatformsProvider,
    private popoverCtrl: PopoverController,
    private bdbExcel: BdBExcelProvider,
    private userFeature: UserFeaturesDelegateService,
    private loadingCtrl: LoadingController,
    private bdbModal: BdbModalProvider,
    private transactionHistoryDelegateService: TransactionHistoryDelegateService,
    private pulseModalCtrl: PulseModalControllerProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private bdbMask: BdbMaskProvider,
    private getAllDelegateService: GetAllBasicDataDelegateService,
    private creditCardBlockingService: CreditCardBlockingService,
    private creditCardFacade: CreditCardFacade,
    private genericModalService: GenericModalService,
    private pulseToastService: PulseToastService,
    private cardsInfoFacade: CardsInfoFacade,
    private userFacade: UserFacade
  ) {
    this.getDataInMemory();
    this.initYieldFiduciary();
    if (
      this.productDetail.balanceDetail &&
      this.productDetail.balanceDetail !== {}
    ) {
      this.cardData = this.cardsMapper.mapToPCardDetail(this.productDetail);
      this.cardData.cardButton = this.cardData.cardButton.filter(
        (e) => e.id !== 'payroll_request'
      );

      this.cardsMapper
        .mapToPCardDetailAdn(this.productDetail)
        .subscribe((adn) => {
          if (!!adn) {
            this.cardData.cardButton.push(adn);
          }
        });
    } else {
      this.cardData = cardsMapper.mapToPcardDetailError(this.productDetail);
      this.showDetailError = true;
    }
  }

  ionViewWillEnter() {
    this.columns = [];
    this.expandable = [];
    const category = this.productDetail.category;
    switch (category) {
      case BdbConstants.FIDUCIAS_BBOG:
      case BdbConstants.SAVINGS_ACCOUNT:
      case BdbConstants.ATH_SAVINGS_ACCOUNT:
      case BdbConstants.CHECK_ACCOUNT:
      case BdbConstants.ATH_CHECK_ACCOUNT:
      case BdbConstants.CUENTAS_BBOG:
        this.columns = this.tableConfig.getProductHistory().columns;
        this.updateDate();
        this.getForWeb();
        break;
      case BdbConstants.TARJETA_CREDITO_BBOG:
      case BdbConstants.CREDIT_CARD:
        this.loadCreditCardBlockInfo();
      case BdbConstants.CREDIT_CARD_MC:
      case BdbConstants.CREDIT_CARD_VISA:
      case BdbConstants.ENR_CREDITCARD:
        const productHistoryCreditCard = this.tableConfig.getProductHistoryCC();
        this.columns = productHistoryCreditCard.columns;
        this.expandable = productHistoryCreditCard.expandable;
        this.updateDate();
        this.getForWeb();
        break;
      default:
        this.applyHistory = false;
        break;
    }
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 6);
    this.minDate = currentDate;
    this.events.publish('menu:active', 'DashboardPage');
    this.events.publish('srink', false);
    this.contextMenuList = this.setContextMenuList();
    this.showTable = !(this.productDetail.productTypeBDB === BdbConstants.CDT);
    this.tagdata = [{text: BdbConstants.LAST_MONTH_TAG, value: 'DATE'}];
    this.showShareAccountInfo();
  }

  ionViewWillLeave() {
    if (!!this.creditCardSubscription) {
      this.creditCardFacade.creditCardActivationReset();
      this.creditCardSubscription.unsubscribe();
    }
  }

  getDataInMemory(): void {
    this.productDetail = this.bdbInMemory.getItemByKey(
      InMemoryKeys.ProductDetail
    );
    if (this.bdbInMemory.getItemByKey(InMemoryKeys.textFiduciary)) {
      this.textAssetsFiduciary = this.bdbInMemory.getItemByKey(
        InMemoryKeys.textFiduciary
      );
    } else {
      this.textAssetsFiduciary = {};
    }
  }

  updateDate() {
    const lastMonth = this.bdbUtils.calculateLastMonth();
    this.endDt = lastMonth[1];
    this.startDt = lastMonth[0];
  }

  getForWeb() {
    this.showTransactionsLoader = true;
    if (this.productDetail.category === BdbConstants.FIDUCIAS_BBOG) {
      this.getMovementsFiduciary();
    } else {
      this.getTransactions();
    }
  }

  private showErrorMovements(): void {
    this.transactionsLoaded = [];
    this.transactionsWeb = [];
    this.showTransactionsError = true;
    this.dismissLoader();
  }

  private getMovementsFiduciary(): void {
    const path = `get-movements`;
    this.showTransactionsError = false;
    const typeFund = this.productDetail.productNumber.slice(0, 3);
    const numberFund = this.productDetail.productNumber.slice(3, 14);
    const requestBody = this.transactions.buidlServiceOperationRequestFiduciary(
      numberFund,
      typeFund,
      !!this.newSelectedDate ? this.newSelectedDate[0] : this.startDt,
      !!this.newSelectedDate ? this.newSelectedDate[1] : this.endDt
    );
    this.transactions.getServiceOperationFiduciary(path, requestBody).subscribe(
      (dataMovements: TransactionsResponseFiduciary) => {
        if (!!dataMovements) {
          const listMovementsFiduciary =
            dataMovements.activityOrderList.activityFiduciaryOrderList;
          if (listMovementsFiduciary.length > 0) {
            this.updateTransactionFiduciary(listMovementsFiduciary);
          } else {
            this.updateTransactionFiduciary([]);
          }
        } else {
          this.updateTransactionFiduciary([]);
        }
      },
      () => {
        this.showErrorMovements();
      }
    );
  }

  public initYieldFiduciary(): void {
    if (this.productDetail.category === BdbConstants.FIDUCIAS_BBOG &&
      this.productDetail.balanceDetail) {
        this.updateDate();
        this.showFiduciaryDetails = true;
        this.showLoaderDetail = true;
        this.productDetail.balanceDetail['rendimientoMensualFBOG'] = '0';
        this.productDetail.balanceDetail['rendimientoAnualFBOG'] = '0';
        this.getYieldFiduciary();
    }
  }

  getYieldFiduciary(): void {
    const path = `get-yield`;
    const typeFund = this.productDetail.productNumber.slice(0, 3);
    const numberFund = this.productDetail.productNumber.slice(3, 14);
    const requestBody = this.transactions.buidlServiceOperationRequestFiduciary(
      numberFund,
      typeFund,
      !!this.newSelectedDate ? this.newSelectedDate[0] : this.startDt,
      !!this.newSelectedDate ? this.newSelectedDate[1] : this.endDt
      );
    this.transactions.getServiceOperationFiduciary(path, requestBody).subscribe(
      (resp: any) => {
      (resp.message.sum > 0) ? this.showPlusSymbol = true : this.showPlusSymbol = false;
      this.productDetail.balanceDetail['rendimientoMensualFBOG'] = resp.message.sum;
      this.productDetail.balanceDetail['rendimientoAnualFBOG'] = resp.message.yieldPercentage;
      this.cardData = this.cardsMapper.mapToPCardDetail(this.productDetail);
      this.showErrorFiduciary = false;
      this.showLoaderDetail = false;
    }, () => {
       this.showErrorFiduciary = true;
       this.showLoaderDetail = false;
    });
  }

  onReloadFiduciary(): void {
    this.showLoaderDetail = true;
    this.getYieldFiduciary();
    this.updateLayout = true;
  }

  private updateTransactionFiduciary(
    movements: DataMovementsFiduciary[]
  ): void {
    this.transactionsWeb = [];
    this.dismissLoader();
    this.transactionsLoaded = [];
    const transactionsDateFiduciaryList: TransactionsDate[] = [];
    const transactionsDateFiduciary: TransactionsDate = new TransactionsDate(
      '',
      []
    );
    movements.forEach((movement: DataMovementsFiduciary) => {
      const amountFiduciary = new Amount(
        Number(movement.value),
        (Number(movement.value) > 0 && movement.type === 'Rendimientos') ||
          movement.type === 'Inversión'
      );
      const transactionFiduciary = new Transaction(
        movement.date,
        movement.type,
        amountFiduciary
      );
      transactionFiduciary.symbol = amountFiduciary.positive ? '+' : '';
      this.transactionsWeb.push(transactionFiduciary);
    });
    transactionsDateFiduciary.transactions = this.transactionsWeb;
    transactionsDateFiduciaryList.push(transactionsDateFiduciary);
    this.transactionsLoaded = transactionsDateFiduciaryList;
  }

  messageNoTxHistoryFB(productDetail: ProductDetail): string {
    return productDetail.productType === BdbConstants.ATH_FUDUCIARY
      ? 'Podrás consultar tus movimientos en el extracto que te llegará de forma física y correo electrónico.'
      : 'Consulta tus movimientos en los extractos.';
  }

  getTransactions() {
    this.showTransactionsError = false;

    const transactionParams = {
      acctId: this.productDetail.productNumberApi,
      acctType: this.productDetail.productTypeBDB,
      startDt: !!this.newSelectedDate ? this.newSelectedDate[0] : this.startDt,
      endDt: !!this.newSelectedDate ? this.newSelectedDate[1] : this.endDt,
    };

    this.transactionHistoryDelegateService.getTransactionHistory(transactionParams).subscribe(
      (data: Array<TransactionsDate>) => {
        if (data.length > 0) {
          this.updateTransactions(data);
        }
        this.dismissLoader();
      },
      () => {
        this.showTransactionsError = true;
        this.dismissLoader();
      }
    );
  }

  updateTransactions(data) {
    this.transacionEvent = new TransactionEvent(
      this.productDetail.productType,
      data
    );
    this.transactionsLoaded = this.transacionEvent.transactionsDate;
    this.transactionsWeb = [];
    this.transactionsLoaded.forEach((e) => {
      e.transactions.forEach((t) => {
        t.symbol = t.amount.positive ? '+' : '';
        this.transactionsWeb.push(t);
      });
    });
  }

  dismissLoader() {
    this.showTransactionsLoader = false;
  }

  onBackPressed() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.setRoot('DashboardPage');
    }
  }

  onLogout() {
    this.navCtrl.push('authentication/logout');
  }

  exportData(event) {
    if (this.bdbPlatforms.isMobile()) {
      this.getCsvFile();
    } else {
      this.openContextMenu(event);
    }
  }

  openContextMenu(myEvent) {
    const popover = this.popoverCtrl.create(
      'ContextMenuPage',
      { data: this.contextMenuList, showContextArrow: false },
      {
        cssClass: 'contextPopOver',
      }
    );
    popover.present({
      ev: myEvent,
    });
    popover.onDidDismiss((data: any) => {
      if (!!data && !!data.event && !!data.event.key) {
        switch (data.event.key) {
          case 'csv':
            this.getCsvFile();
            break;
          case 'excel':
            this.getTrxFile();
            break;
        }
      }
    });
  }

  getTrxFile() {
    const trxFileRq = new HistoryTxDwnRq();
    trxFileRq.typeFile = BdbConstants.MOVEMENTS_HISTORY.label;
    trxFileRq.reportData = this.buildCsvFile();
    this.bdbExcel.callExcelFileService(trxFileRq);
  }

  buildCsvFile() {
    let salida = this.transactionsLoaded
      .map((date) => {
        return date.transactions
          .map((row) => {
            const separator = ';';
            return `${row.date}${separator}'${row.description}'${separator}${row.amount.amount}`;
          })
          .join('\r\n');
      })
      .join('\r\n');
    const summaryCols = 'Tipo de cuenta;Número;Saldo\r\n';
    const summary = `${this.productDetail.productName};${this.productDetail.productNumber};${this.productDetail.amount}\r\n\r\n`;
    const columns = 'Fecha;Descripción;Valor\r\n';

    salida = `${summaryCols}${summary}${columns}${salida}`;
    return salida;
  }

  getCsvFile() {
    const dateTime = this.dateFormat.transform(new Date(), 'dMyyhmmss');
    const fileName = `mov${dateTime}`;
    const outData = this.buildCsvFile();
    this.pdfProvider.generatCSV(outData, fileName, 'text/csv');
  }

  setContextMenuList() {
    return [
      {
        key: 'excel',
        value: 'Excel',
        color: 'blue-white-card',
      },
      {
        key: 'csv',
        value: '.csv',
        color: 'blue-white-card',
      },
    ];
  }

  validateDateMobile() {
    return (i: any, data: any, dataSource: any) => {
      if (i === 0 || (i > 0 && data.date !== dataSource[i - 1].date)) {
        return data.date;
      }
      return false;
    };
  }

  onProductReload() {
    this.showLoaderDetail = true;
    this.avalOps.getBalancesByAccount(this.productDetail).subscribe(
      (balance: GetBalancesByAccountRs) => {
        const bDetail = mapDetailsBalance(balance.details);
        this.productDetail.balanceDetail = bDetail;
        this.initYieldFiduciary();
        this.cardData = this.cardsMapper.mapToPCardDetail(this.productDetail);
        this.showErrorFiduciary = false;
        this.updateLayout = true;
        this.showLoaderDetail = false;
      },
      (err) => {
        this.showLoaderDetail = false;
      }
    );
  }

  cardShrinkChange(e) {
    this.isShrinkCard = e;
    if (this.isShrinkCard) {
      const contentHeight =
        86 +
        this.hm.nativeElement.offsetHeight +
        this.ht.nativeElement.offsetHeight;
      if (contentHeight <= window.innerHeight) {
        this.divHeight = window.innerHeight - contentHeight + 10;
      }
    }
  }

  lockCardDetail() {
    this.confirmCreditCardBlock(!this.lockCreditCard);
  }


  private async showFilterModal(): Promise<void> {
    const modal = await this.pulseModalCtrl.create({
      component: ModalFilterComponent,
      componentProps: {title: 'Buscar movimientos'},
      size: 'large',
    }, this.viewRef, this.resolver);

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (!!data) {
      this.newSelectedDate = data.dateCalendarSelected;
      if (data.dateCalendarSelected[0] === data.dateCalendarSelected[1]) {
          this.tagdata = [{text: this.bdbMask.maskFormatFactory(data.dateCalendarSelected[0], MaskType.DATE), value: 'DATE'}];
      } else {
        this.tagdata = [{text: data.dateCalendarSelected
        .map( d => this.bdbMask.maskFormatFactory(d, MaskType.DATE))
        .reduce((dates, date) => `${dates} - ${date}`), value: 'DATE'}];
      }
    } else {
      this.tagdata = [{text: BdbConstants.LAST_MONTH_TAG, value: 'DATE'}];
       const lastMonth = this.bdbUtils.calculateLastMonth();
      this.newSelectedDate = [lastMonth[0], lastMonth[1]];
    }
    this.showTransactionsLoader = true;
    this.transactionsWeb = [];
    this.getForWeb();
  }

  private disabled(): boolean {
    return this.showTransactionsLoader || (this.transactionsWeb.length < 1);
  }

  private loadCreditCardBlockInfo(): void {
    const cardActivationRq: CreditCardActivationRq = {
      cardId: this.productDetail.productNumberApi
    };
    this.creditCardFacade.creditCardAccountInfo(cardActivationRq);
    this.creditCardSubscription = this.creditCardFacade.creditCardActivationState$.subscribe(
      async ccResponse => {
        if (!!ccResponse.accountInfoSuccess) {

          await this.userFacade.userFeatures$
            .pipe(take(1))
            .subscribe((userFeatures: UserFeatures) => {
              this.showBlockedCreditCardInfo = userFeatures.toggle.allowedServices.toggleTC;
            });
          if (!!ccResponse.accountInfoSuccess.lockId) {
            this.frozenTag = !this.creditCardBlockingService.disableButton(ccResponse.accountInfoSuccess.lockId);
            this.descriptionLockCard = this.creditCardBlockingService.getBlockText(ccResponse.accountInfoSuccess.lockId);
            this.lockCreditCard = true;
            this.showRequestCardButton =
            this.creditCardBlockingService.showRequestCardButton(ccResponse.accountInfoSuccess.lockId);
            this.showBlockedCreditCardInfo = this.creditCardBlockingService.enabledToFreeze(ccResponse.accountInfoSuccess.lockId);
          }
        }
        if (!!ccResponse.blockSuccess) {
          this.cardsInfoFacade.refreshCardsInfo();
          this.frozenTag = true;
          this.descriptionLockCard = this.creditCardBlockingService.getBlockText(this.creditCardBlockingService.PREVENTIVE_BY_OFFICE);
          this.lockCreditCard = true;
          await this.pulseToastService.create(this.creditCardBlockingService.getToastCreditCard(this.lockCreditCard));
        }
        if (!!ccResponse.unblockSuccess) {
          this.frozenTag = false;
          this.cardsInfoFacade.refreshCardsInfo();
          this.lockCreditCard = false;
          await this.pulseToastService.create(this.creditCardBlockingService.getToastCreditCard(this.lockCreditCard));
        }
        this.disabledAdvanceButton(this.lockCreditCard);
        if (!!ccResponse.blockError || !!ccResponse.unblockError) {
          const genericModalData: GenericModalModel =
            this.creditCardBlockingService.buildModalError(this.navCtrl, this.creditCardFacade);
          this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
        }
      }
    );
  }

  private disabledAdvanceButton(frozen: boolean): void {
    this.cardData.cardButton.forEach(card => {
      if (card.id === 'advance') {
        card.disbled = frozen;
      }
    });
  }

  private confirmCreditCardBlock(blocking: boolean): void {
    const genericModalData: GenericModalModel =
      this.creditCardBlockingService.buildModalData(blocking, this.productDetail.productNumberApi, this.creditCardFacade);
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

  private showShareAccountInfo(): boolean {
    if (this.productDetail.productTypeBDB === 'SDA' || this.productDetail.productTypeBDB === 'DDA' ) {
      return this.shareAccountInfo = true;
    }
  }

}

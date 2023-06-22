import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { App, IonicPage, LoadingController, NavController } from 'ionic-angular';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { TransferInfo } from '../../../../app/models/transfers/transfer-info';
import { TransactionsProvider } from '../../../../providers/transactions/transactions';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { MobileSummaryProvider, SummaryBody } from '../../../../components/mobile-summary';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { TransfersDelegateService } from '@app/delegate/transfers-delegate/transfers-delegate.service';
import { DoTransferRs } from '@app/apis/transfer-account/models/doTrasfer.model';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { ErrorMapperType } from '../../../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { CatalogsEnum } from '@app/delegate/list-parameters/enums/catalogs-enum';
import { Observable } from 'rxjs/Observable';
import { filter, take } from 'rxjs/operators';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import {
  TrxResultTransferAcctService
} from '@app/shared/modules/transaction-result/services/transfers/transaction-result-accounts.service';
import { LimitsFacade } from '@app/modules/settings/store/facades/limits.facade';
import { Subscription } from 'rxjs/Subscription';
import { AccountLimitsRq } from '../../../../app/models/limits/get-accounts-limits-request';
import { LimitsRs } from '../../../../app/models/limits/get-accounts-limits-response';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';
import { UpdateLimitState } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.types';

@IonicPage()
@Component({
  selector: 'page-transfers-transfer',
  templateUrl: 'transfers-transfer.html',
})
export class TransfersTransferPage {

  private readonly CONST_AVAL_HOLD_TRANSFERS_CODE = '000000';

  items: Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> = [];
  accounts: Array<ProductDetail>;
  subtitle: string;
  msgButton: string;
  enable = false;
  abandonText = BdbConstants.ABANDON_TRANS;
  navTitle = 'Transferencias Entre Cuentas';
  isModalOpen = false;
  cost$: Observable<string>;
  private _funnel = this.funnelKeys.getKeys().transfers;

  private limitsSubscription: Subscription;
  private accountToIsOwned: boolean;

  constructor(
    public navCtrl: NavController,
    public appCtrl: App,
    public bdbInMemory: BdbInMemoryProvider,
    public selectAccountHandler: SelectAccountHandlerProvider,
    public funnelKeys: FunnelKeysProvider,
    public funnelEvents: FunnelEventsProvider,
    public transactions: TransactionsProvider,
    public loading: LoadingController,
    public navigation: NavigationProvider,
    public mobileSummary: MobileSummaryProvider,
    public bdbPlatforms: BdbPlatformsProvider,
    private progressBar: ProgressBarProvider,
    private transfersDelegateService: TransfersDelegateService,
    private genericModalService: GenericModalService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private userFacade: UserFacade,
    private txResultService: TrxResultTransferAcctService,
    private limitsFacade: LimitsFacade,
    private microfrontendService: BdbMicrofrontendEventsService
  ) {
    this.subtitle = 'Selecciona la cuenta de origen';
    this.msgButton = 'Realizar transferencia';
    this.enable = false;
    this.limitsFacade.clearLimits();
  }

  ionViewWillLeave(): void {
    if (!!this.limitsSubscription) {
      this.limitsSubscription.unsubscribe();
    }
  }


  ionViewWillEnter() {
    const transferInfo: TransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TransferInfo);
    this.accountToIsOwned = transferInfo.accountTo.owned;
    this.accounts =
      !!this.accountToIsOwned ?
        this.selectAccountHandler.getAccountsAvailable(true, false, transferInfo.accountTo.accountOwned) :
        this.selectAccountHandler.getAccountsAvailable(true);

    this.loadLimits(this.accounts);

    if (!!this.accounts && this.accounts.length > 0) {
      this.items = this.selectAccountHandler.getCardsMapping(this.accounts);
      const mAccount: ProductDetail = this.selectAccountHandler.setFirstAccountSelection(this.accounts, this._funnel);
      if (mAccount !== null) {
        const loading = this.loading.create();
        this.validateAmountLimit(loading, this.items[0], () => {
          this.enable = true;
          transferInfo.account = mAccount;
          this.bdbInMemory.setItemByKey(InMemoryKeys.TransferInfo, transferInfo);
        });

      }
      this.getTransactionCost();
      this.updateAmount();
    } else {
      this.navCtrl.setRoot('NewTransferMenuPage');
    }
    this.setUpProgressBar(transferInfo);
  }

  private setUpProgressBar(transferInfo: TransferInfo) {
    if (!!transferInfo && transferInfo.accountTo) {
      const product = transferInfo.accountTo;
      this.progressBar.setLogo(product.owned ? BdbConstants.BBOG_LOGO_WHITE : '');
      this.progressBar.setContraction(product.owned ? '' : product.accountEnrolled.contraction);
      this.updateProgressBar(
        BdbConstants.PROGBAR_STEP_1,
        product.owned ? product.accountOwned.productName : product.accountEnrolled.productAlias,
        product.owned ?
          [product.accountOwned.productNumber, 'Banco de Bogotá'] :
          [product.accountEnrolled.productNumber, product.accountEnrolled.productBank],
        true
      );
    }
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
    this.updateProgressBar(BdbConstants.PROGBAR_STEP_3, 'Cuenta origen', [''], false);
  }

  private loadLimits(accountsToConsult: ProductDetail[]): void {
    const loading = this.loading.create();
    loading.present();
    this.limitsFacade.fetchLimits(accountsToConsult.map(p => {
      return {
        accountId: p.productNumberApi,
        accountType: p.productTypeBDB
      };
    }));

    this.limitsFacade.getAllLimits$
      .pipe(
        filter(limits => !!limits && limits.length > 0),
        take(1))
      .subscribe(limits => {
        loading.dismiss();
      });
  }

  private validateAmountLimit(loading, item, executeToContinue): void {
    loading.present();
    this.items.forEach((e) => {
      e.isActive = false;
    });
    this.selectAccountHandler.paymentSelected(
      item,
      this._funnel);

    if (this.accountToIsOwned) {
      loading.dismiss();
      executeToContinue();
      return;
    }

    this.limitsSubscription = this.limitsFacade.getLimitByAccountId(item.acct.productNumberApi)
      .pipe(
        filter(value => !!value),
        take(1))
      .subscribe(limit => {

        if (!!limit.complete) {
          const transferInfo: TransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TransferInfo);
          transferInfo.account = item.acct;
          loading.dismiss();
          const limitAmountForPB = limit.limits.find(l => l.channel === 'PB').amount;

          if ((+transferInfo.amount > +limitAmountForPB) || (+transferInfo.amount > +limit.natAccountLimit.amount)) {
            const { productName } = transferInfo.account;
            this.launchNoHasEnoughLimitErrorModal(
              productName,
              limit.accountId,
              limit.natAccountLimit.amount,
              limitAmountForPB,
              () => {

                const accountLimitsRq = new AccountLimitsRq();
                accountLimitsRq.accountNumber = item.acct.productNumberApi;
                accountLimitsRq.accountType = item.acct.productTypeBDB;
                const limits = limit.limits.map(limitI => {
                  const transLimit = new LimitsRs();
                  transLimit.desc = limitI.desc;
                  transLimit.networkOwner = limitI.channel;
                  transLimit.trnCount = limitI.count;
                  transLimit.amount = limitI.amount;
                  return transLimit;
                });

                this.bdbInMemory.setItemByKey(InMemoryKeys.AccountLimits, limits);
                this.bdbInMemory.setItemByKey(InMemoryKeys.AccountLimitsRq, accountLimitsRq);
                const updateInformation = {
                  acctId: accountLimitsRq.accountNumber,
                  acctType: accountLimitsRq.accountType
                };
                this.microfrontendService.saveStateInSessionStorage<UpdateLimitState>('UpdateLimitState', updateInformation);
                this.microfrontendService.sendRouteEventToParentWindow('/settings/limits-form?origin=warning');
              });

            this.enable = false;
          } else {
            executeToContinue();
          }
        } else {
          loading.dismiss();
          this.enable = true;
        }
      }, error => {
        loading.dismiss();
        this.enable = true;
      });

  }


  public paymentSelected(item): void {
    const transferInfo: TransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TransferInfo);
    transferInfo.account = item.acct;
    const loading = this.loading.create();
    this.validateAmountLimit(loading, item, () => {
      this.enable = true;
      this.bdbInMemory.setItemByKey(InMemoryKeys.TransferInfo, transferInfo);
    });
  }

  public send(): void {
    this.enable = false;
    this.process(false);
  }

  private process(retry: boolean): void {
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.confirmation);
    const transferInfo: TransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TransferInfo);

    const loading = this.loading.create();
    loading.present();

    this.transfersDelegateService.doTransfer(transferInfo, retry).subscribe({
      next: (doTransferRs: DoTransferRs) => {
        this.buildResultData(transferInfo, true, doTransferRs.approvalId);
      },
      error: (ex) => {
        this.cost$.pipe(take(1)).subscribe(transactionCost => {
          const newTransferInfo = {...transferInfo, transactionCost: this.getCost(transferInfo, transactionCost)};
          try {
            loading.dismiss();
            switch (ex.errorType) {
              case ErrorMapperType.DuplicatedTransaction:
                this.launchModalDuplicatedTransaction();
                break;
              case ErrorMapperType.Timeout:
                this.manageDoTransferTimeout(newTransferInfo);
                break;
              default:
                this.buildResultData(newTransferInfo, false, '', ex.error ? ex.error : null);
            }
          } catch (error) {
            this.buildResultData(newTransferInfo, false);
          }
        });
      },
      complete: () => {
        loading.dismiss();
      }
    });
  }

  private manageDoTransferTimeout(transferInfo: TransferInfo): void {
    if (transferInfo.isAval) {
      this.launchInfoPageTimeOut(transferInfo);
    } else {
      this.buildResultData(transferInfo, true);
    }
  }

  private launchInfoPageTimeOut(transferInfo: TransferInfo): void {
    this.navCtrl.push('OperationInfoPage', {
      data: {
        amount: Number(transferInfo.amount),
        amountText: 'Valor de la transferencia',
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

  private launchModalDuplicatedTransaction(): void {
    this.enable = true;
    this.launchErrorModal(
      'assets/imgs/generic-modal/icon-duplicated-warning.svg',
      'Transacción repetida',
      'En las últimas 24 horas hiciste una transacción por el mismo valor y destino.',
      '¿Quieres realizarla de nuevo?',
      'No',
      'Sí',
      () => {
        this.navCtrl.setRoot('NewTransferMenuPage');
      },
      () => {
        this.process(true);
      }
    );

  }

  private launchNoHasEnoughLimitErrorModal(
    productName: string = 'Cuenta',
    accountId: string,
    natAccountLimitAmount: string,
    limitPb: string,
    callbackChangeLimits
  ): void {

    const natAccountLimitFormatted = CurrencyFormatPipe.format(natAccountLimitAmount);
    const limitPbFormatted = CurrencyFormatPipe.format(limitPb);
    this.launchErrorModal(
      'assets/imgs/generic-modal/icon-tx-alert.svg',
      'Esta transacción supera tus topes',
      `Tu ${productName} No. ${accountId}
        tiene los siguientes topes establecidos: <br>
        Límite de cuenta: ${natAccountLimitFormatted} <br>
        Banca Virtual: ${limitPbFormatted} <br> `
      , `Debes cambiarlos y volver a intentar.`,
      'Cancelar',
      'Cambiar topes',
      () => {},
      () => { callbackChangeLimits(); }
    );
  }

  private launchErrorModal(
    imgSrcPath: string,
    title: string,
    description: string,
    question: string,
    actionText: string,
    actionText_2: string,
    actionModal: () => void,
    actionModal2
  ): void {
    const genericModalData: GenericModalModel = {
      icon: {
        src: imgSrcPath,
        alt: 'warning'
      },
      modalTitle: title,
      modalInfoData: `<span>${description}<br><b>${question}</b><br><br></span>`,
      actionButtons: [
        {
          id: 'generic-btn-action-1',
          buttonText: actionText,
          block: true,
          fill: 'outline',
          action: actionModal
        },
        {
          id: 'generic-btn-action-2',
          buttonText: actionText_2,
          block: true,
          colorgradient: true,
          action: actionModal2
        }
      ]
    };
    this.isModalOpen = true;
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

  updateMobileSummary(amount: string, transactionCost: string) {
    const body: SummaryBody = new SummaryBody();
    body.textUp = 'Valor a transferir';
    body.valueUp = CurrencyFormatPipe.format(amount);
    body.textDown = 'Costo de la transacción';
    body.valueDown = transactionCost;
    this.mobileSummary.setBody(body);
  }

  public onBackPressed(): void {
    this.updateProgressBar(BdbConstants.PROGBAR_STEP_3, 'Cuenta origen', [''], false);
    this.navigation.onBackPressed(this.navCtrl);
  }

  private updateProgressBar(step: string, title: string, details: string[], isDone: boolean): void {
    this.progressBar.setTitle(step, title);
    this.progressBar.setDetails(step, details);
    this.progressBar.setDone(step, isDone);
  }

  public onAbandonClicked(): void {
    this.progressBar.resetObject();
    this.navCtrl.setRoot('NewTransferMenuPage');
  }

  private getTransactionCost(): void {
    this.userFacade.getCatalogue(CatalogsEnum.VALOR_TRANSACCIONES);
    this.cost$ = this.userFacade.transactionCostByType$('ACH_TRANSFER');
  }

  private updateAmount() {
    this.cost$.pipe(take(1)).subscribe(catalogueCost => {
      const transferInfo: TransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TransferInfo);
      const cost = this.getCost(transferInfo, catalogueCost);
      this.selectAccountHandler.updateAmountProgressBar(transferInfo.amount, cost);
      this.updateMobileSummary(transferInfo.amount, cost);
    });
  }

  private getCost(transferInfo, catalogueCost): string {
    const achCost = !!catalogueCost ? `${catalogueCost}` : 'NO_AVAILABLE';
    return transferInfo.isAval ? `$ 0` : achCost;
  }

  private buildResultData(transferInfo: TransferInfo, isSuccess: boolean, approvalId: string = '', errorData?: ApiGatewayError): void {
    const state: TransactionResultState = !isSuccess ? 'error' :
      (!!isSuccess && (!transferInfo.isAval || (transferInfo.isAval && approvalId === this.CONST_AVAL_HOLD_TRANSFERS_CODE)) ?
        'pending' : 'success');
    this.txResultService.launchResultTransfer(this.navCtrl, state, transferInfo, approvalId, errorData);
  }
}

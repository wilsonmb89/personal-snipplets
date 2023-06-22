import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IonicPage, LoadingController, NavController } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { TrustAgreementInfo } from '../../../../app/models/trust-agreement/trust-agreement-info';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { TransfersDelegateService } from '@app/delegate/transfers-delegate/transfers-delegate.service';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { DoTransferRs } from '@app/apis/transfer-account/models/doTrasfer.model';
import { ErrorMapperType } from '../../../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { TrxResultFiduciaryService } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-fiduciary.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { BdbMaskProvider, MaskType } from '../../../../providers/bdb-mask';

@PageTrack({ title: 'fiducia-transfer' })
@IonicPage({
  segment: 'fiducia%transfer'
})
@Component({
  selector: 'trust-agreement-transfer',
  templateUrl: 'trust-agreement-transfer.html',
})
export class TrustAgreementTransferPage {

  items: Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> = [];
  accounts: Array<ProductDetail>;
  subtitle: string;
  msgButton: string;
  abandonText = BdbConstants.ABANDON_TRANS;
  navTitle = 'Fiducias';
  enable = false;
  isModalOpen = false;

  private _funnel = this.funnelKeys.getKeys().fiducias;

  constructor(
    public navCtrl: NavController,
    private bdbInMemory: BdbInMemoryProvider,
    private funnelKeys: FunnelKeysProvider,
    private selectAccountHandler: SelectAccountHandlerProvider,
    private navigation: NavigationProvider,
    private progressBar: ProgressBarProvider,
    private transfersDelegateService: TransfersDelegateService,
    private funnelEvents: FunnelEventsProvider,
    public loading: LoadingController,
    private genericModalService: GenericModalService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private txResultService: TrxResultFiduciaryService,
    private bdbMask: BdbMaskProvider,
  ) {
    const trust: TrustAgreementInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TrustAgreementInfo);
    if (trust.operation === 'investment') {
      this.subtitle = 'Selecciona la cuenta de origen';
    } else {
      this.subtitle = 'Selecciona la cuenta de destino';
    }
    this.msgButton = 'Confirmar transferencia';
  }

  ionViewWillEnter() {

    this.accounts = this.selectAccountHandler.getAccountsAvailable(true);
    this.items = this.selectAccountHandler.getCardsMapping(this.accounts);
    let mAccount: ProductDetail = this.selectAccountHandler.setFirstAccountSelection(this.accounts, this._funnel);
    const trust: TrustAgreementInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TrustAgreementInfo);

    if (!!mAccount) {

      mAccount = this.accountExistOnListOfAccounts(mAccount, this.accounts);
      if (!!mAccount) {
        this.enable = true;
        trust.account = mAccount;
        this.bdbInMemory.setItemByKey(InMemoryKeys.TrustAgreementInfo, trust);
      } else {
        this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, null);
      }
    }
    this.selectAccountHandler.updateAmountProgressBar(trust.amount, BdbConstants.TRANSACTION_COST.NO_COST);
    this.summaryFromSessionStorage();

  }

  private accountExistOnListOfAccounts(account: ProductDetail, accounts: ProductDetail[]): ProductDetail {
    return accounts.find(acc => {
      return acc.productDetailApi.productNumber === account.productDetailApi.productNumber;
    });
  }

  paymentSelected(item) {
    this.enable = true;
    this.items.forEach((e) => {
      e.isActive = false;
    });
    this.selectAccountHandler.paymentSelected(item, this._funnel);
    // add to model
    const trust: TrustAgreementInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TrustAgreementInfo);
    trust.account = item.acct;
    this.bdbInMemory.setItemByKey(InMemoryKeys.TrustAgreementInfo, trust);

  }

  send(retry: boolean) {
    const trust: TrustAgreementInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TrustAgreementInfo);
    const loading = this.loading.create();
    loading.present();
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.confirmation);
    this.transfersDelegateService.callFiduciaryOperations(trust, retry).subscribe({
      next: (doTransferRs: DoTransferRs) => {
        this.buildResultData(trust, true, doTransferRs.approvalId);
      },
      error: (ex) => {
        try {
          loading.dismiss();
          switch (ex.errorType) {
            case ErrorMapperType.DuplicatedTransaction:
              this.launchModalDuplicatedTransaction();
              break;
            case ErrorMapperType.Timeout:
              this.launchInfoPageTimeOut(trust);
              break;
            default:
              this.buildResultData(trust, false, '', ex.error ? ex.error : null);
          }
        } catch (error) {
          this.buildResultData(trust, false);
        }
      },
      complete: () => {
        loading.dismiss();
      }
    });
  }

  private launchInfoPageTimeOut(trust: TrustAgreementInfo): void {
    this.navCtrl.push('OperationInfoPage', {
      data: {
        amount: Number(trust.amount),
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
        this.send(true);
      }
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
      modalInfoData: `<span>${description}<br><b>${question}</b></span>`,
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

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navigation.abandonTransaction(this.navCtrl);
  }

  private buildResultData(
    trust: TrustAgreementInfo,
    isSuccess: boolean,
    approvalId: string = '',
    errorData?: ApiGatewayError,
  ): void {
    const state: TransactionResultState = !isSuccess ? 'error' : 'success';
    this.txResultService.launchResultTransfer(this.navCtrl, state, trust, approvalId, errorData);
  }

  private summaryFromSessionStorage(): void {
    const trust: TrustAgreementInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TrustAgreementInfo);
    if (!!trust) {
      if (this.progressBar.getInstance().steps[0].title === 'concepto') {
        const operation = trust.operation;
        this.progressBar.setLogo(BdbConstants.BBOG_LOGO_WHITE);
        this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, operation === 'investment' ? 'Destino' : 'Origen');
        this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, operation === 'investment' ? 'Origen' : 'Destino');
        this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [trust.agreement.productName,
          `Disponible: ${this.bdbMask.maskFormatFactory(trust.agreement.balanceDetail['disponibleBBOG'], MaskType.CURRENCY)}`]);
        this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);
      }
      if (!!trust.amount) {
        const amount = this.bdbMask.maskFormatFactory(trust.amount, MaskType.CURRENCY).replace(',00', '');
        this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [amount, 'Costo: $ 0']);
      }
    }
  }
}

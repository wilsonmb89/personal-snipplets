import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { LoanTransferInfo } from '../../../../app/models/loan-transfer/loan-transfer-info';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { LoanOpsProvider } from '../../../../providers/loan-ops/loan-ops';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { SelectAccountHandlerProvider } from '../../../../providers/select-account-handler/select-account-handler';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbMaskProvider, MaskType } from '../../../../providers/bdb-mask';
import { DoTransferRs } from '@app/apis/transfer-account/models/doTrasfer.model';
import { ErrorMapperType } from '../../../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { TransfersDelegateService } from '@app/delegate/transfers-delegate/transfers-delegate.service';

@PageTrack({ title: 'page-loan-transfer-transfer' })
@IonicPage()
@Component({
  selector: 'page-loan-transfer-transfer',
  templateUrl: 'loan-transfer-transfer.html',
})
export class LoanTransferTransferPage {

  items: Array<{cardTitle, cardLabel, cardValue, isActive, acct}> =  [];
  accounts: Array<ProductDetail>;
  subtitle: string;
  msgButton: string;
  navTitle = 'Uso de Crédito';
  enable = false;
  abandonText = BdbConstants.ABANDON_TRANS;
  isModalOpen = false;

  private _funnel = this.funnelKeys.getKeys().loanTransfer;

  constructor(
    public navCtrl: NavController,
    private bdbInMemory: BdbInMemoryProvider,
    private funnelKeys: FunnelKeysProvider,
    private selectAccountHandler: SelectAccountHandlerProvider,
    private loanOps: LoanOpsProvider,
    private navigation: NavigationProvider,
    private progressBar: ProgressBarProvider,
    private bdbMask: BdbMaskProvider,
    public loading: LoadingController,
    private genericModalService: GenericModalService,
    private transfersDelegateService: TransfersDelegateService ,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver
  ) {
    this.subtitle = 'Selecciona la cuenta de destino';
    this.msgButton = 'Confirmar transferencia';
  }

  ionViewWillEnter() {
    this.accounts = this.selectAccountHandler.getAccountsAvailable(false);
    this.items = this.selectAccountHandler.getCardsMapping(this.accounts);
    const loanTransfer: LoanTransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanTransferInfo);
    const mAccount: ProductDetail = this.selectAccountHandler.setFirstAccountSelection(this.accounts, this._funnel);
    if (mAccount !== null) {
      // add to model
      this.enable = true;
      loanTransfer.account = mAccount;
      this.bdbInMemory.setItemByKey(InMemoryKeys.LoanTransferInfo, loanTransfer);
    }
    this.selectAccountHandler.updateAmountProgressBar(loanTransfer.amount, BdbConstants.TRANSACTION_COST.NO_COST);
    this.summaryFromSessionStorage();
  }

  paymentSelected(item) {
    this.enable = true;
    this.items.forEach((e) => {
      e.isActive = false;
    });
    this.selectAccountHandler.paymentSelected(item, this._funnel);
    // add to model
    const loanTransfer: LoanTransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanTransferInfo);
    loanTransfer.account = item.acct;
    this.bdbInMemory.setItemByKey(InMemoryKeys.LoanTransferInfo, loanTransfer);
  }

  send() {
    this.enable = false;
    this.process(false);

  }

  private process(retry: boolean): void {
    const loanTransfer: LoanTransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanTransferInfo);

    const loading = this.loading.create();
    loading.present();

    this.transfersDelegateService.useCredit(loanTransfer, retry).subscribe({
      next: (data: DoTransferRs) => {
          this.loanOps.buildResultData(loanTransfer, true, data.approvalId, this.navCtrl);
        },
      error: (ex)  => {
          try {
            loading.dismiss();
            switch (ex.errorType) {
              case ErrorMapperType.DuplicatedTransaction:
                this.launchModalDuplicatedTransaction();
                break;
              case ErrorMapperType.Timeout:
                return this.loanOps.launchInfoPageTimeOut(loanTransfer.amount, this.navCtrl);
              default:
                this.loanOps.buildResultData(loanTransfer, false, '', ex.error ? ex.error : null);
            }
          } catch (error) {
            this.loanOps.buildResultData(loanTransfer, false, '', ex.error );
          }
        },
        complete: () => {
          loading.dismiss();
        }
      });
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navigation.abandonTransaction(this.navCtrl);
  }

  private summaryFromSessionStorage(): void {
    const loanTransfer: LoanTransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.LoanTransferInfo);
    if (!!loanTransfer) {
      if (this.progressBar.getInstance().steps[0].title === 'concepto') {
        this.progressBar.setLogo(BdbConstants.BBOG_LOGO_WHITE);
        this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Origen');
        this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [loanTransfer.loan.productName,
          `Disponible: ${this.bdbMask.maskFormatFactory(loanTransfer.loan.balanceDetail.cupoDispoCreSerBBOG, MaskType.CURRENCY)}`]);
        this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);
      }
      if (!!loanTransfer.amount) {
        const amount = this.bdbMask.maskFormatFactory(loanTransfer.amount, MaskType.CURRENCY).replace(',00', '');
        this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [amount, 'Costo: $ 0']);
      }
    }
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
}

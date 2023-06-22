import { Component, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IonicPage, LoadingController, NavController } from 'ionic-angular';

import { RadioOptionCard } from '@app/shared/models/components/radio-selection-options.model';
import { SelectAccountHandlerProvider } from '../../../../../../../providers/select-account-handler/select-account-handler';
import { ProgressBarProvider } from '../../../../../../../providers/progress-bar/progress-bar';
import { MobileSummaryProvider, SummaryBody, SummaryHeader } from '../../../../../../../components/mobile-summary';
import { ProductDetail } from '../../../../../../../app/models/products/product-model';
import { BdbConstants } from '../../../../../../../app/models/bdb-generics/bdb-constants';
import { FacilpassAccount, FacipassRechargeRq } from '@app/apis/payment-nonbillers/models/facilpass-recharge.model';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { RechargesService } from '@app/modules/payments/services/recharges.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { TrxResultFacilpassService } from '@app/shared/modules/transaction-result/services/payments/transaction-result-facilpass.service';
import { ErrorMapperType } from '../../../../../../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';

@IonicPage({
  name: 'facilpass%set%account',
  segment: 'facilpass-set-account'
})
@Component({
  selector: 'facilpass-set-account-page',
  templateUrl: './facilpass-set-account.html'
})
export class FacilpassSetAccountPage {

  private readonly facilpassLogo = 'assets/imgs/payments/recharges/facilpass-logo.svg';
  validPaymentOrigin = false;
  accountItems: Array<RadioOptionCard> = [];

  constructor(
    private navCtrl: NavController,
    private selectAccountHandler: SelectAccountHandlerProvider,
    private progressBar: ProgressBarProvider,
    public mobileSummary: MobileSummaryProvider,
    private bdbStorageService: BdbStorageService,
    private rechargesService: RechargesService,
    private loading: LoadingController,
    private txResultService: TrxResultFacilpassService,
    private genericModalService: GenericModalService,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
  ) { }

  ionViewWillEnter(): void {
    this.resetPage();
    this.getAvaliableAccounts();
    this.updateFromSavedData();
  }

  public goPreviousPage(): void {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    } else {
      this.goToRechargesPage();
    }
  }

  public goToRechargesPage(): void {
    this.navCtrl.setRoot(
      'PaymentsMainPage', { 'tab': 'recharge' }
    );
  }

  private getAvaliableAccounts(): void {
    this.accountItems = [];
    const accounts = this.selectAccountHandler.getAccountsAvailable(true);
    if (!!accounts && accounts.length > 0) {
      this.accountItems = this.selectAccountHandler
        .getCardsMapping(accounts).map(this.mapRadioOptionCard);
      this.validateUniqueAccount();
    }
  }

  private validateUniqueAccount(): void {
    if (!!this.accountItems && this.accountItems.length === 1) {
      const accountItem = this.accountItems[0];
      this.paymentSelected(accountItem);
    }
  }

  private mapRadioOptionCard(item: { cardTitle, cardLabel, cardValue, isActive, acct }): RadioOptionCard {
    const option = new RadioOptionCard();
    option.cardTitle = item.cardTitle;
    option.cardLabel = item.cardLabel;
    option.cardValue = item.cardValue;
    option.selected = item.isActive;
    option.acct = item.acct;
    return option;
  }

  public paymentSelected(item: RadioOptionCard): void {
    this.setSelectedPayment(item.acct);
    this.updateProgressBar(item.cardTitle, item.cardLabel);
  }

  private setSelectedPayment(acct: ProductDetail): void {
    this.validPaymentOrigin = true;
    this.saveAccountData(acct);
  }

  private saveAccountData(acct: ProductDetail): void {
    const facilpassData: FacipassRechargeRq = this.bdbStorageService.getItemByKey(InMemoryKeys.FacilpassData);
    if (!!facilpassData) {
      const account: FacilpassAccount = {
        accountType: acct.productDetailApi.productBankType,
        accountNumber: acct.productNumberApi,
        accountName: acct.productName
      };
      facilpassData.account = account;
      this.bdbStorageService.setItemByKey(InMemoryKeys.FacilpassData, facilpassData);
    }
  }

  private updateProgressBar(accTitle: string, accNumber: string): void {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, [
      accTitle,
      `No. ${accNumber}`
    ]);
  }

  private updateFromSavedData(): void {
    const facilpassData: FacipassRechargeRq = this.bdbStorageService.getItemByKey(InMemoryKeys.FacilpassData);
    if (!!facilpassData) {
      const codeNIE = facilpassData.codeNIE || '';
      const amount = facilpassData.amount || '';
      this.sessionRefreshProgressSummary(codeNIE, amount);
      this.sessionRefreshMobileSummary(codeNIE, amount);
    } else {
      this.navCtrl.setRoot('DashboardPage');
    }
  }

  private sessionRefreshProgressSummary(codeNURE: string, amount: string): void {
    const progressBar = this.progressBar.getInstance();
    if (!!codeNURE && progressBar.steps[0].title === 'concepto') {
      this.progressBar.setLogo(this.facilpassLogo);
      this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'FacilPass');
      this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);
      this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [`NURE: ${codeNURE}`]);
      this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_2, 'Valor de la recarga');
      this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [amount]);
      this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Cuenta origen');
    }
  }

  private sessionRefreshMobileSummary(codeNURE: string, amount: string): void {
    let header: SummaryHeader = this.mobileSummary.getInstance().header;
    let body: SummaryBody = this.mobileSummary.getInstance().body;
    if (!!codeNURE) {
      if (!!header) {
        header.details = [`NURE: ${codeNURE}`];
      } else {
        header = new SummaryHeader();
        header.title = 'FacilPass';
        header.details = [`NURE: ${codeNURE}`];
        header.logoPath = this.facilpassLogo;
        this.mobileSummary.setHeader(header);
      }
      if (!!body) {
        body.valueUp = amount;
      } else {
        body = new SummaryBody();
        body.textUp = !!amount ? 'Valor a recargar:' : '';
        body.valueUp = amount || '';
        body.textDown = 'Costo de la recarga (sin IVA):';
        body.valueDown = 'Gratis';
        this.mobileSummary.setBody(body);
      }
    }
  }

  private resetPage(): void {
    this.accountItems.forEach(acc => acc.selected = false);
    this.validPaymentOrigin = false;
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_3, true);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, []);
  }

  public submit(retry: boolean = false): void {
    const loading = this.loading.create();
    loading.present();
    this.rechargesService.doFacilpassRecharge(retry).subscribe({
      next: (res) => {
        this.buildResultData(true, res.approvalId);
        this.bdbStorageService.clearItem(InMemoryKeys.FacilpassData);
        loading.dismiss();
      },
      error: (ex) => {
        this.handleRechargeError(ex);
        loading.dismiss();
      }
    });
  }

  private handleRechargeError(ex: any): void {
    try {
      switch (ex.errorType) {
        case ErrorMapperType.DuplicatedTransaction:
          this.launchModalDuplicatedTransaction();
          break;
        case ErrorMapperType.Timeout:
          this.launchInfoPageTimeOut();
          break;
        default:
          this.buildResultData(false, '', ex.error ? ex.error : null);
      }
    } catch (error) {
      this.buildResultData(false);
    }
  }

  private launchInfoPageTimeOut(): void {
    const facilpassInfo: FacipassRechargeRq = this.bdbStorageService.getItemByKey(InMemoryKeys.FacilpassData);
    this.navCtrl.push('OperationInfoPage', {
      data: {
        amount: Number(facilpassInfo.amount.replace(/\D/g, '')),
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
          this.navCtrl.setRoot('DashboardPage');
        }
      }
    });
  }

  private launchModalDuplicatedTransaction(): void {
    this.launchErrorModal(
      'assets/imgs/generic-modal/icon-duplicated-warning.svg',
      'Transacción repetida',
      'En las últimas 24 horas hiciste una transacción por el mismo valor y destino.',
      '¿Quieres realizarla de nuevo?',
      'No',
      () => {
        this.goToRechargesPage();
      },
      'Sí',
      () => {
        this.submit(true);
      }
    );
  }

  private launchErrorModal(
    imgSrcPath: string,
    title: string,
    description: string,
    question: string,
    actionText: string,
    actionModal: () => void,
    actionText_2?: string,
    actionModal2?: () => void
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
        }
      ]
    };
    if (!!actionText_2 && !!actionModal2) {
      genericModalData.actionButtons.push(
        {
          id: 'generic-btn-action-2',
          buttonText: actionText_2,
          block: true,
          colorgradient: true,
          action: actionModal2
        }
      );
    }
    this.genericModalService.launchGenericModal(this.viewRef, this.resolver, genericModalData);
  }

  private buildResultData(isSuccess: boolean, approvalId: string = '', errorData?: ApiGatewayError): void {
    const facilpassInfo: FacipassRechargeRq = this.bdbStorageService.getItemByKey(InMemoryKeys.FacilpassData);
    facilpassInfo.amount = facilpassInfo.amount.replace(/\D/g, '');
    const state: TransactionResultState = isSuccess ? 'success' : 'error';
    this.txResultService.launchResultTransfer(this.navCtrl, state, facilpassInfo, approvalId, errorData);
  }
}

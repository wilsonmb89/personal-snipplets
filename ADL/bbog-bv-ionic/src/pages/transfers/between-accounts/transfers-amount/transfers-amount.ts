import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Events, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NonZeroAmtValidator } from '../../../../validators/minAmmt';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { AccountAny } from '../../../../app/models/enrolled-transfer/account-any';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { MobileSummaryProvider, SummaryHeader } from '../../../../components/mobile-summary';
import { TransferInfo } from '../../../../app/models/transfers/transfer-info';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';
import { TokenOtpProvider } from '../../../../providers/token-otp/token-otp/token-otp';
import { TransfersDelegateService } from '@app/delegate/transfers-delegate/transfers-delegate.service';
import { DoTransferRs } from '@app/apis/transfer-account/models/doTrasfer.model';
import { UserFeaturesDelegateService } from '@app/delegate/user-features/user-features-delegate.service';
import { ErrorMapperType } from '../../../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { Observable } from 'rxjs/Observable';
import { CatalogsEnum } from '../../../../new-app/core/services-delegate/list-parameters/enums/catalogs-enum';
import { take } from 'rxjs/operators';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import {
  TrxResultTransferAcctService
} from '@app/shared/modules/transaction-result/services/transfers/transaction-result-accounts.service';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';

@PageTrack({ title: 'basic-amount-input' })
@IonicPage({
  name: 'amount%input',
  segment: 'transfer-amount'
})
@Component({
  selector: 'page-transfers-amount',
  templateUrl: 'transfers-amount.html',
})
export class TransfersAmountPage {

  private readonly CONST_AVAL_HOLD_TRANSFERS_CODE = '000000';

  private amountForm: FormGroup;
  aval: boolean;
  subtitle: string;
  cost$: Observable<string>;
  billIdActive = false;
  noteActive = false;
  inputPh: string;
  nameBtnSubmit = 'Continuar';
  colorBtnSubmit = 'bdb-blue';
  leftHdrOption = 'Atrás';
  hideLeftOption = false;
  navTitle = 'Transferencias Entre Cuentas';
  abandonText = BdbConstants.ABANDON_TRANS;
  isModalOpen = false;

  @ViewChild('submitCore') submitCore;
  @ViewChild('submitMobile') submitMobile;

  private _funnel = this.funnelKeys.getKeys().transfers;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private bdbInMemory: BdbInMemoryProvider,
    private progressBar: ProgressBarProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider,
    private accessDetail: AccessDetailProvider,
    private mobileSummary: MobileSummaryProvider,
    private loading: LoadingController,
    private navigation: NavigationProvider,
    private navParams: NavParams,
    public events: Events,
    public bdbPlatforms: BdbPlatformsProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private tokenOtpProvider: TokenOtpProvider,
    private userFeaturesService: UserFeaturesDelegateService,
    private transfersDelegateService: TransfersDelegateService,
    private genericModalService: GenericModalService,
    private userFacade: UserFacade,
    private txResultService: TrxResultTransferAcctService,
  ) {
    const transferInfo: TransferInfo = bdbInMemory.getItemByKey(InMemoryKeys.TransferInfo);
    this.aval = transferInfo.isAval;
    this.amountForm = this.formBuilder.group({
      amount: ['', [Validators.required, NonZeroAmtValidator.isValid]],
      note: [],
      billId: []
    });
    this.subtitle = '¿Cuánto quieres transferir?';
    this.inputPh = 'Digita el valor';

    if (this.navParams.get('option')) {
      this.leftHdrOption = '';
      this.hideLeftOption = true;
      events.publish('header:btn:remove', 'left');
    }
  }

  ionViewWillEnter() {
    const transferInfo: TransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TransferInfo);
    const product = transferInfo.accountTo;
    this.setUpProgressBar(product);
    this.getTransactionCost();
    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
      this.nameBtnSubmit = 'Confirmar transferencia';
      this.colorBtnSubmit = 'mango';
    }
    this.setUpMobileSummary(product);
    this.events.publish('srink', true);
  }

  ionViewWillLeave() {
    this.events.publish('header:btn:add');
  }

  changeAmount(event) {
    this.cost$.pipe(take(1)).subscribe(catalogueCost => {
      const unparsedAmount: string = event.target.value;
      const amount = CurrencyFormatPipe.unFormat(unparsedAmount);
      const achCost = !!catalogueCost ? `Costo: ${catalogueCost}` : 'NO_AVAILABLE';
      const cost = this.aval ? `Costo: $ 0` : achCost;
      this.updateProgressBarAmount([
        unparsedAmount,
        cost
      ], true);
    });
  }

  updateProgressBarAmount(details: Array<string>, isDone: boolean) {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, details);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, isDone);
  }

  setUpMobileSummary(product: AccountAny) {
    const header: SummaryHeader = new SummaryHeader();
    if (product.owned) {
      header.title = product.accountOwned.productName;
      header.logoPath = BdbConstants.BBOG_LOGO_WHITE;
      header.hasContraction = false;
      header.details = [product.accountOwned.productNumber];
    } else {
      header.title = product.accountEnrolled.productAlias;
      header.hasContraction = true;
      header.contraction = product.accountEnrolled.contraction;
      header.details = [product.accountEnrolled.productNumber];
    }
    this.mobileSummary.setHeader(header);
    this.mobileSummary.setBody(null);
  }

  setUpProgressBar(product: AccountAny) {
    if (product.owned) {
      this.progressBar.setLogo(BdbConstants.BBOG_LOGO_WHITE);
      this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, product.accountOwned.productName);
      this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [
        product.accountOwned.productNumber,
        'Banco de Bogotá'
      ]);
    } else {
      this.progressBar.setLogo('');
      this.progressBar.setContraction(product.accountEnrolled.contraction);
      this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, product.accountEnrolled.productAlias);
      this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_1, [
        product.accountEnrolled.productNumber,
        product.accountEnrolled.productBank
      ]);
    }
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_3, 'Cuenta origen');
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, ['']);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);
  }

  public continue(): void {
    this.userFeaturesService.getUserSettings().subscribe(
      (settings) => {
        const parsedAmount = +CurrencyFormatPipe.unFormat(this.amountForm.value.amount);
        if (parsedAmount >= settings.amounts.maxAmountBeforeRequestSecurity) {
          this.tokenOtpProvider.requestToken(this.viewRef, this.resolver,
            () => {
              this.launchTransfer(false);
            }, 'accountTransfer');

        } else {
          this.launchTransfer(false);
        }

      }, (e) => this.launchTransfer(false));

  }

  resetFields() {
    this.bdbInMemory.setItemByKey(InMemoryKeys.UnmaskedAmt, '');
    this.bdbInMemory.setItemByKey(InMemoryKeys.Concept, '');
    this.bdbInMemory.setItemByKey(InMemoryKeys.Note, '');
  }

  toggleBillId() {
    this.billIdActive = true;
    this.noteActive = false;
  }

  toggleNote() {
    this.noteActive = true;
    this.billIdActive = false;
  }

  onBackPressed() {
    this.updateProgressBarAmount([''], false);
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.progressBar.resetObject();
    this.navCtrl.setRoot('NewTransferMenuPage');
  }


  private launchTransfer(retry: boolean): void {
    const transferInfo: TransferInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.TransferInfo);
    transferInfo.amount = CurrencyFormatPipe.unFormat(this.amountForm.value.amount);
    transferInfo.billId = this.amountForm.value.billId;
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.amount);
    transferInfo.note = this.amountForm.value.note;
    this.bdbInMemory.setItemByKey(InMemoryKeys.TransferInfo, transferInfo);
    if (this.accessDetail.isOriginSelected()) {
      transferInfo.account = this.accessDetail.getOriginSelected();
      this.bdbInMemory.setItemByKey(InMemoryKeys.TransferInfo, transferInfo);
      this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.confirmation);
      const loading = this.loading.create();
      loading.present().then(() => {

        this.transfersDelegateService.doTransfer(transferInfo, retry).subscribe((doTransferRs: DoTransferRs) => {
          loading.dismiss();
          this.buildResultData(transferInfo, true, doTransferRs.approvalId);
        },
          ex => {
            this.cost$.pipe(take(1)).subscribe(transactionCost => {
              const newTransferInfo = { ...transferInfo, transactionCost: this.getCost(transferInfo, transactionCost) };
              loading.dismiss();
              try {
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
          });

      });
    } else {
      this.resetFields();
      this.navCtrl.push('TransfersTransferPage');
    }
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
        this.launchTransfer(true);
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

  private getTransactionCost(): void {
    this.userFacade.getCatalogue(CatalogsEnum.VALOR_TRANSACCIONES);
    this.cost$ = this.userFacade.transactionCostByType$('ACH_TRANSFER');
  }

  private getCost(transferInfo, catalogueCost): string {
    const achCost = !!catalogueCost ? `${catalogueCost}` : 'NO_AVAILABLE';
    return transferInfo.isAval ? `$ 0` : achCost;
  }

  private buildResultData(transferInfo: TransferInfo, isSuccess: boolean, approvalId: string = '', errorData?: ApiGatewayError): void {
    const state: TransactionResultState = !isSuccess ? 'error' :
      (!!isSuccess
        && (!transferInfo.isAval || (transferInfo.isAval && approvalId === this.CONST_AVAL_HOLD_TRANSFERS_CODE)) ?
        'pending' : 'success');
    this.txResultService.launchResultTransfer(this.navCtrl, state, transferInfo, approvalId, errorData);
  }
}

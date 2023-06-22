import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { PaymentNonBillersApiService } from '../../../core/services-apis/payment-nonbillers/payment-nonbillers-api.service';
import {
  AcctBasicInfo,
  NewBankInfo,
  ObligationPaymentRq,
  ObligationPaymentRs,
  PaymentInfo,
} from '@app/apis/payment-nonbillers/models/obligation-payment.model';
import { LoanPaymentInfo } from '../../../../app/models/credits/loan-payment-info';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { CreditCardPaymentInfo } from '../../../../app/models/tc-payments/credit-card-payment-info';
import { AccountAny } from '../../../../app/models/enrolled-transfer/account-any';
import { ErrorMapperType } from '../../../core/http/http-client-wrapper/http-client-wrapper.service';
import { ModalRs } from '../../../../app/models/modal-rs/modal-rs';
import { FunnelKeyModel } from '../../../../providers/funnel-keys/funnel-key-model';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { LoadingController, NavController } from 'ionic-angular';
import { TrxResultCreditCardService } from '@app/shared/modules/transaction-result/services/payments/transaction-result-creditcard.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { TrxResultCreditService } from '@app/shared/modules/transaction-result/services/payments/transaction-result-credit.service';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';
import { GenericModalModel } from '@app/shared/components/modals/generic-modal/model/generic-modal.model';

@Injectable()
export class ObligationPaymentsService {
  isModalOpen = false;

  constructor(
    private paymentNonBillersApiService: PaymentNonBillersApiService,
    private funnelEvents: FunnelEventsProvider,
    private loading: LoadingController,
    private txCCResultService: TrxResultCreditCardService,
    private txCreditResultService: TrxResultCreditService,
    private genericModalService: GenericModalService,
    private resolver: ComponentFactoryResolver
  ) {
  }

  public payObligations(
    _funnel: FunnelKeyModel,
    oblInfo: LoanPaymentInfo | CreditCardPaymentInfo,
    navCtrl: NavController,
    viewRef: ViewContainerRef,
    force= false) {
    const loanPaymentInfoRq: ObligationPaymentRq = {...this.buildPaymentRq(oblInfo), forceTrx: force};
    const loader = this.loading.create();
    loader.present();
    this.paymentNonBillersApiService.doPayment(loanPaymentInfoRq).subscribe({
      next: (rs: ObligationPaymentRs) => {
        this.funnelEvents.callFunnel(_funnel, _funnel.steps.confirmation);
        this.buildResultData(navCtrl, oblInfo, true, rs.approvalId);
      },
      error: (ex) => {
        try {
          loader.dismiss();
          switch (ex.errorType) {
            case ErrorMapperType.DuplicatedTransaction:
              this.launchModalDuplicatedTransaction(_funnel, oblInfo, navCtrl, true, viewRef);
              break;
            case ErrorMapperType.Timeout:
              this.launchInfoPageTimeOut(oblInfo, navCtrl);
              break;
            default:
              this.buildResultData(navCtrl, oblInfo, false, '', ex.error ? ex.error : null);
          }
        } catch (error) {
          this.buildResultData(navCtrl, oblInfo, false);
        }
      },
      complete: () => {
        loader.dismiss();
      }
    });
  }

  private launchModalDuplicatedTransaction(
    _funnel: FunnelKeyModel,
    oblInfo: LoanPaymentInfo | CreditCardPaymentInfo,
    navCtrl: NavController, 
    retry: boolean,
    viewRef: ViewContainerRef): void {
    this.launchErrorModal(
      'assets/imgs/generic-modal/icon-duplicated-warning.svg',
      'Pago repetido',
      'En las últimas 24 horas hiciste un pago por el mismo valor y destino.',
      '¿Quieres realizarlo de nuevo?',
      'No, cancelar',
      'Sí, pagar',
      () => {
        navCtrl.setRoot('PaymentsMainPage');
      },
      () => {
        this.payObligations(_funnel, oblInfo, navCtrl, viewRef, retry);
      },
      viewRef
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
    actionModal2,
    viewRef: ViewContainerRef
  ): void {
    const genericModalData: GenericModalModel = {
      icon: {
        src: imgSrcPath,
        alt: 'warning'
      },
      modalTitle: title,
      modalInfoData: `<span>${description}<br><br><b>${question}</b><br><br></span>`,
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
    this.genericModalService.launchGenericModal(viewRef, this.resolver, genericModalData);
  }

  public buildPaymentRq(obligationPaymentInfo: LoanPaymentInfo | CreditCardPaymentInfo): ObligationPaymentRq {
    let acctBasicInfoTo, acctBasicInfoFrom: AcctBasicInfo;
    let paymentInfo: PaymentInfo;
    const paymentType = obligationPaymentInfo.paymentType;
    acctBasicInfoFrom = this.buildAcctBasicInfo(obligationPaymentInfo, true, false);

    if (this.getTypePayment(obligationPaymentInfo).owned) {
      acctBasicInfoTo = this.buildAcctBasicInfo(obligationPaymentInfo, false, true);
      paymentInfo = this.buildPaymentInfo(obligationPaymentInfo, true);
    } else {
      acctBasicInfoTo = this.buildAcctBasicInfo(obligationPaymentInfo, false, false);
      paymentInfo = this.buildPaymentInfo(obligationPaymentInfo, false);
    }
    return {
      paymentType: paymentType,
      paymentInfo: paymentInfo,
      acctBasicInfoFrom: acctBasicInfoFrom,
      acctBasicInfoTo: acctBasicInfoTo
    };
  }

  private getTypePayment(obligationPaymentInfo: LoanPaymentInfo | CreditCardPaymentInfo): AccountAny {
    let accountAny: AccountAny;
    if ('loan' in obligationPaymentInfo) {
      accountAny = (obligationPaymentInfo as LoanPaymentInfo).loan;
    } else {
      accountAny = (obligationPaymentInfo as CreditCardPaymentInfo).creditCard;
    }
    return accountAny;
  }

  public buildBankInfo(bankId?: string): NewBankInfo {
    return {
      bankId: bankId ? '0' + bankId.substr(bankId.length - 3) : BdbConstants.BDB_BANK_CODE,
      branchId: BdbConstants.BRANCH_ID,
    };
  }

  public buildAcctBasicInfo(oblPaymentInfo: LoanPaymentInfo | CreditCardPaymentInfo, isAcctFrom: boolean, isOwned: boolean): AcctBasicInfo {
    if (isAcctFrom) {
      return {
        acctId: oblPaymentInfo.account.productDetailApi.productNumber,
        acctType: oblPaymentInfo.account.productDetailApi.productBankType,
        acctSubType: '',
        acctCur: '',
        bankInfo: this.buildBankInfo(),
      };
    } else {
      const account: AccountAny = this.getTypePayment(oblPaymentInfo);
      return {
        acctId: isOwned ?
          account.accountOwned.productDetailApi.productNumber :
          account.accountEnrolled.productNumber,

        acctType: isOwned ?
          account.accountOwned.productDetailApi.productBankType :
          account.accountEnrolled.productType,

        acctSubType: isOwned ?
          account.accountOwned.productDetailApi.productBankSubType :
          account.accountEnrolled.productSubType,

        acctCur: BdbConstants.COP,
        bankInfo: isOwned ?
          this.buildBankInfo() :
          this.buildBankInfo(account.accountEnrolled.bankId),
      };
    }
  }

  public buildPaymentInfo(oblPaymentInfo: LoanPaymentInfo | CreditCardPaymentInfo, isOwned: boolean): PaymentInfo {
    const account: AccountAny = this.getTypePayment(oblPaymentInfo);
    return {
      refType: BdbConstants.RT_CUSTOMER_ISSUED,
      description: isOwned ? `Pago ${account.accountOwned.productDetailApi.productName}` : `Pago ${account.accountEnrolled.productAlias}`,
      value: Number(oblPaymentInfo.amount)
    };
  }

  public buildSuccessModalRs(modalRs: ObligationPaymentRs): ModalRs {
    return new ModalRs(
      'pmtMdl',
      200,
      modalRs.approvalId,
      '',
      '',
      modalRs.message
    );
  }

  public launchInfoPageTimeOut(txinfo: any, navCtrl): void {
    navCtrl.push('OperationInfoPage', {
      data: {
        amount: Number(txinfo.amount),
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
          navCtrl.push('DashboardPage');
        }
      }
    });
  }

  private buildResultData(
    navCtrl: NavController,
    oblInfo: LoanPaymentInfo | CreditCardPaymentInfo,
    isSuccess: boolean,
    approvalId: string = '',
    errorData?: ApiGatewayError
  ): void {
    if ((oblInfo as LoanPaymentInfo).loan) {
      this.buildCreditResultData(navCtrl, oblInfo as LoanPaymentInfo, isSuccess, approvalId, errorData);
    } else {
      this.buildCCResultData(navCtrl, oblInfo as CreditCardPaymentInfo, isSuccess, approvalId, errorData);
    }
  }

  private buildCCResultData(
    navCtrl: NavController,
    ccPaymentInfo: CreditCardPaymentInfo,
    isSuccess: boolean,
    approvalId: string = '',
    errorData?: ApiGatewayError
  ): void {
    const state: TransactionResultState = !!isSuccess ? 'success' : 'error';
    this.txCCResultService.launchResultTransfer(navCtrl, state, ccPaymentInfo, approvalId, errorData);
  }

  private buildCreditResultData(
    navCtrl: NavController,
    loanPaymentInfo: LoanPaymentInfo,
    isSuccess: boolean,
    approvalId: string = '',
    errorData?: ApiGatewayError
  ): void {
    const state: TransactionResultState = !!isSuccess ? 'success' : 'error';
    this.txCreditResultService.launchResultTransfer(navCtrl, state, loanPaymentInfo, approvalId, errorData);
  }

}

import { Injectable, ViewContainerRef } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { ModalRs } from '../../app/models/modal-rs/modal-rs';
import { CreditCardPaymentInfo } from '../../app/models/tc-payments/credit-card-payment-info';
import {
  ModalConfDetail,
  ModalConfHeader,
  ModalConfirmation,
  ModalConfSubHeader
} from '../../components/confirmation-modal';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { MaskType } from '../bdb-mask/bdb-mask-type.enum';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { EnrollProvider } from '../enroll/enroll';
import { FunnelKeyModel } from '../funnel-keys/funnel-key-model';
import { LoanOpsProvider } from '../loan-ops/loan-ops';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { ObligationPaymentsService } from '../../new-app/modules/payments/services/obligation-payments.service';

@Injectable()
export class CreditCardOpsProvider {
  viewRef: ViewContainerRef;

  constructor(
    private bdbMask: BdbMaskProvider,
    private bdbUtils: BdbUtilsProvider,
    private loanOps: LoanOpsProvider,
    private loading: LoadingController,
    private enroll: EnrollProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private obligationPaymentsService: ObligationPaymentsService
  ) { }

  sendPayment(ccPaymentInfo: CreditCardPaymentInfo, _funnel: FunnelKeyModel, navCtrl: NavController, viewRef: ViewContainerRef) {
    this.obligationPaymentsService.payObligations(_funnel, ccPaymentInfo, navCtrl, viewRef );
  }

  buildCreditCardPaymentModalObject(modalRs: ModalRs, ccPaymentInfo: CreditCardPaymentInfo): ModalConfirmation {
    const modalInfo: ModalConfirmation = new ModalConfirmation();
    const modalConfHeader = new ModalConfHeader();
    const modalConfSubHeader = new ModalConfSubHeader();
    const modalConfLeft = new ModalConfDetail();
    const modalConfRight = new ModalConfDetail();
    const modalConfDetails = new Array<ModalConfDetail>();

    let bank: string;
    let prodNumber: string;
    let franchise: string;

    if (ccPaymentInfo.creditCard.owned) {
      bank = ccPaymentInfo.creditCard.accountOwned.productBank;
      prodNumber = ccPaymentInfo.creditCard.accountOwned.productNumber;
      franchise = ccPaymentInfo.creditCard.accountOwned.franchise;
    } else {
      bank = ccPaymentInfo.creditCard.accountEnrolled.productBank;
      prodNumber = ccPaymentInfo.creditCard.accountEnrolled.productNumber;
      franchise = ccPaymentInfo.creditCard.accountEnrolled.productSubType;
    }

    ccPaymentInfo.franchise = franchise === 'MC' ? 'MasterCard' : 'Visa';

    modalConfHeader.modalTitle = 'Pago exitoso';
    modalConfHeader.authNumber = modalRs.authCode;
    modalConfHeader.dateTime = modalRs.transactionDate;
    modalConfSubHeader.subTitle = 'Tarjeta de Crédito';
    modalConfSubHeader.desc = [bank, `${ccPaymentInfo.franchise} ${prodNumber}`];
    modalConfLeft.detailTitle = 'Valor del pago';
    modalConfLeft.desc = this.bdbMask.maskFormatFactory(ccPaymentInfo.amount, MaskType.CURRENCY);
    modalConfRight.detailTitle = 'Costo de transacción';
    modalConfRight.desc = ccPaymentInfo.transactionCost;

    modalConfDetails.push(
      {
        detailTitle: 'Cuenta de origen',
        desc: `${ccPaymentInfo.account.productName} - No. ${ccPaymentInfo.account.productNumber}`
      }
    );

    modalInfo.modalConfHeader = modalConfHeader;
    modalInfo.modalConfSubHeader = modalConfSubHeader;
    modalInfo.modalConfLeft = modalConfLeft;
    modalInfo.modalConfRight = modalConfRight;
    modalInfo.modalConfDetails = modalConfDetails;
    modalInfo.btnLeft = 'Hacer otro pago';
    modalInfo.btnRight = 'Finalizar';

    return modalInfo;
  }
}

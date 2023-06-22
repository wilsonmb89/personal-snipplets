import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransactionResultModel, TransactionResultState, TransactionResultControls, TransactionTypes } from '../../models/transaction-result.model';
import { BdbMaskProvider, MaskType } from '../../../../../../providers/bdb-mask';
import { ApiGatewayError } from '../../../../models/api-gateway/api-gateway-error.model';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { ProductDetail } from '../../../../../../app/models/products/product-model';
import { CreditCardPaymentInfo } from '../../../../../../app/models/tc-payments/credit-card-payment-info';
import { AccountAny } from '../../../../../../app/models/enrolled-transfer/account-any';

@Injectable()
export class TrxResultCreditCardService {

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
    private transactionMain: TransactionResultMainService
  ) { }

  public launchResultTransfer(
    navController: NavController,
    state: TransactionResultState,
    ccPaymentInfo: CreditCardPaymentInfo,
    approvalId?: string,
    errorData?: ApiGatewayError
  ): void {
    const accountAny: AccountAny = ccPaymentInfo.creditCard;
    const accountFrom = accountAny.accountOwned ? accountAny.accountOwned : accountAny.accountEnrolled;
    const accountTo: ProductDetail = ccPaymentInfo.account;
    const franchise = accountFrom.productType === 'MC' ? 'MASTERCARD' : 'VISA';
    let transactionData: TransactionResultModel = {
      type: TransactionTypes.LOAN_PAYMENT,
      state,
      header: {
        showStamp: true,
        title: 'Pago exitoso',
        voucherId: approvalId || ''
      },
      body: {
        amtInfo: {
          amt: this.bdbMaskProvider.maskFormatFactory(ccPaymentInfo.amount, MaskType.CURRENCY),
          amtLabel: 'Valor del pago'
        },
        destination: {
          type: accountFrom.productName,
          originName: accountFrom.productBank,
          originId: `${franchise} No. ${this.transactionMain.maskField(accountFrom.productNumber)}`
        },
        originAcct: `${accountTo.productName} No. ${this.transactionMain.maskField(accountTo.productNumber)}`,
        transactionCost: ccPaymentInfo.transactionCost,
        mailData: BdbConstants.EMAIL_OPTIONS.PAY
      },
      controls: this.buildTransferControls(state, navController)
    };
    if (state === 'error') {
      transactionData = this.transactionMain.buildErrorResult(transactionData, errorData);
    }
    this.transactionMain.navigateResultPage(transactionData, navController);
  }

  private buildTransferControls(state: TransactionResultState, navController: NavController): TransactionResultControls {
    const controls: TransactionResultControls = {};
    if (state === 'success') {
      controls.controlEmail =
        this.transactionMain.getResultControl('', () => {});
      controls.controlMainButton =
        this.transactionMain.getResultControl(
          'Ir a productos',
          this.transactionMain.getPageNavigationFunc('DashboardPage', navController)
        );
      controls.controlSecondaryButton =
        this.transactionMain.getResultControl(
          'Otro pago',
          this.transactionMain.getPageNavigationFunc('PaymentsMainPage', navController, { 'tab': 'cc-payments' })
        );
    } else if (state === 'error') {
      controls.controlMainButton =
        this.transactionMain.getResultControl('Entendido', this.transactionMain.getPageNavigationFunc('DashboardPage', navController));
      controls.controlSecondaryButton =
        this.transactionMain.getResultControl('Volver', this.transactionMain.getGoBackFunction(navController));
    }
    return controls;
  }

}

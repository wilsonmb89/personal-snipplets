import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransactionResultModel, TransactionResultState, TransactionResultControls, TransactionTypes } from '../../models/transaction-result.model';
import { BdbMaskProvider, MaskType } from '../../../../../../providers/bdb-mask';
import { ApiGatewayError } from '../../../../models/api-gateway/api-gateway-error.model';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { ProductDetail } from '../../../../../../app/models/products/product-model';
import { AccountAny } from '../../../../../../app/models/enrolled-transfer/account-any';
import { LoanPaymentInfo } from '../../../../../../app/models/credits/loan-payment-info';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';

@Injectable()
export class TrxResultCreditService {

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
    private transactionMain: TransactionResultMainService
  ) { }

  public launchResultTransfer(
    navController: NavController,
    state: TransactionResultState,
    loanPaymentInfo: LoanPaymentInfo,
    approvalId?: string,
    errorData?: ApiGatewayError
  ): void {
    const accountAny: AccountAny = loanPaymentInfo.loan;
    const accountFrom = accountAny.accountOwned ? accountAny.accountOwned : accountAny.accountEnrolled;
    const accountTo: ProductDetail = loanPaymentInfo.account;
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
          amt: CurrencyFormatPipe.format(loanPaymentInfo.amount),
          amtLabel: 'Valor del pago'
        },
        destination: {
          type: accountFrom.productName,
          originName: accountFrom.productBank,
          originId: `No. ${this.transactionMain.maskField(accountFrom.productNumber)}`,
        },
        originAcct: `${accountTo.productName} No. ${this.transactionMain.maskField(accountTo.productNumber)}`,
        transactionCost: loanPaymentInfo.transactionCost,
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
          this.transactionMain.getPageNavigationFunc('PaymentsMainPage', navController, { 'tab': 'credits-payment' })
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

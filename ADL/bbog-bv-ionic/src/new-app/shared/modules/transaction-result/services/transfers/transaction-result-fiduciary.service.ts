import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransactionResultModel, TransactionResultState, TransactionResultControls, TransactionTypes } from '../../models/transaction-result.model';
import { BdbMaskProvider, MaskType } from '../../../../../../providers/bdb-mask';
import { ApiGatewayError, CustomerErrorMessage } from '../../../../models/api-gateway/api-gateway-error.model';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { TrustAgreementInfo } from '../../../../../../app/models/trust-agreement/trust-agreement-info';
import { ProductDetail } from '../../../../../../app/models/products/product-model';

@Injectable()
export class TrxResultFiduciaryService {

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
    private transactionMain: TransactionResultMainService
  ) { }

  public launchResultTransfer(
    navController: NavController,
    state: TransactionResultState,
    trustInfo: TrustAgreementInfo,
    approvalId?: string,
    errorData?: ApiGatewayError
  ): void {
    const isInvestment = trustInfo.operation === 'investment';
    const origin: ProductDetail = isInvestment ? trustInfo.account : trustInfo.agreement;
    const destination: ProductDetail = isInvestment ? trustInfo.agreement : trustInfo.account;
    const customerErrorMessage = !!errorData ? errorData.customerErrorMessage : null;
    // ToDo Delete this work around when the traduction errors service brings an actions model object
    const serverStatusCode = (!!errorData && !!errorData.serverStatusCode ? errorData.serverStatusCode : '');
    // End ToDo
    let transactionData: TransactionResultModel = {
      type: isInvestment ? TransactionTypes.INVESTMENT : TransactionTypes.DISINVESTMENT,
      state,
      header: {
        showStamp: false,
        title: 'Transferencia exitosa',
        voucherId: approvalId || ''
      },
      body: {
        amtInfo: {
          amt: this.bdbMaskProvider.maskFormatFactory(trustInfo.amount, MaskType.CURRENCY),
          amtLabel: 'Valor de la transferencia'
        },
        destination: {
          type: destination.productName,
          originName: destination.productBank,
          originId: `No. ${this.transactionMain.maskField(destination.productNumber)}`
        },
        originAcct: `${origin.productName} No. ${this.transactionMain.maskField(origin.productNumber)}`,
        transactionCost: BdbConstants.TRANSACTION_COST.NO_COST,
        mailData: BdbConstants.EMAIL_OPTIONS.TRANSFER
      },
      controls: this.buildTransferControls(state, navController, customerErrorMessage, serverStatusCode)
    };
    if (state === 'error') {
      transactionData = this.transactionMain.buildErrorResult(transactionData, errorData);
    }
    this.transactionMain.navigateResultPage(transactionData, navController);
  }

  private buildTransferControls(
    state: TransactionResultState,
    navController: NavController,
    customerErrorMessage: CustomerErrorMessage,
    serverStatusCode: string // ToDo Delete this work around when the traduction errors service brings an actions model object
  ): TransactionResultControls {
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
          'Otra transferencia',
          this.transactionMain.getPageNavigationFunc('NewTransferMenuPage', navController, { 'tab': 'fiduciary' })
        );
    } else if (state === 'error') {
      controls.controlMainButton =
        this.transactionMain.getResultControl('Entendido', this.transactionMain.getPageNavigationFunc('DashboardPage', navController));
      controls.controlSecondaryButton = this.transactionMain.buildErrorActions(customerErrorMessage, navController, serverStatusCode);
    }
    return controls;
  }

}

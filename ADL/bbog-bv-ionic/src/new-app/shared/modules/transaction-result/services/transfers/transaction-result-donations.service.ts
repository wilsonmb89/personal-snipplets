import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransactionResultModel, TransactionResultState, TransactionResultControls, TransactionTypes } from '../../models/transaction-result.model';
import { BdbMaskProvider, MaskType } from '../../../../../../providers/bdb-mask';
import { ApiGatewayError, CustomerErrorMessage } from '../../../../models/api-gateway/api-gateway-error.model';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { TransactionResultMainService } from '../transaction-result-main.service';

@Injectable()
export class TrxResultDonationsService {

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
    private transactionMain: TransactionResultMainService
  ) { }

  public launchResultTransfer(
    navController: NavController,
    state: TransactionResultState,
    donation: {
      donationInfo: { contraction, recipent, charge, amount },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    },
    approvalId?: string,
    errorData?: ApiGatewayError
  ): void {
    const { recipent, amount } = donation.donationInfo;
    const { acct } = donation.accountSeleted;
    const customerErrorMessage = !!errorData ? errorData.customerErrorMessage : null;
    // ToDo Delete this work around when the traduction errors service brings an actions model object
    const serverStatusCode = (!!errorData && !!errorData.serverStatusCode ? errorData.serverStatusCode : '');
    // End ToDo
    let transactionData: TransactionResultModel = {
      type: TransactionTypes.DONATION,
      state,
      header: {
        showStamp: false,
        title: 'Transferencia exitosa',
        voucherId: approvalId || ''
      },
      body: {
        amtInfo: {
          amt: this.bdbMaskProvider.maskFormatFactory(amount, MaskType.CURRENCY),
          amtLabel: 'Valor de la transferencia'
        },
        destination: {
          type: recipent.name,
          originName: '',
          originId: ''
        },
        originAcct: `${acct.productName} No. ${this.transactionMain.maskField(acct.productNumber)}`,
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
          this.transactionMain.getPageNavigationFunc('NewTransferMenuPage', navController, { 'tab': 'donations' })
        );
    } else if (state === 'error') {
      controls.controlMainButton =
        this.transactionMain.getResultControl('Entendido', this.transactionMain.getPageNavigationFunc('DashboardPage', navController));
      controls.controlSecondaryButton = this.transactionMain.buildErrorActions(customerErrorMessage, navController, serverStatusCode);
    }
    return controls;
  }

}

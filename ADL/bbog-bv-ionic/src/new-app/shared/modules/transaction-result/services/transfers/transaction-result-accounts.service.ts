import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransferInfo } from '../../../../../../app/models/transfers/transfer-info';
import { TransactionResultModel, TransactionResultState, TransactionResultControls, TransactionTypes } from '../../models/transaction-result.model';
import { ApiGatewayError, CustomerErrorMessage } from '../../../../models/api-gateway/api-gateway-error.model';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';

@Injectable()
export class TrxResultTransferAcctService {

  constructor(
    private transactionMain: TransactionResultMainService
  ) { }

  public launchResultTransfer(
    navController: NavController,
    state: TransactionResultState,
    transferInfo: TransferInfo,
    approvalId?: string,
    errorData?: ApiGatewayError
  ): void {
    const accountTo = transferInfo.account;
    const accountToAny = transferInfo.accountTo;
    const accountFrom: any = accountToAny.accountOwned ? accountToAny.accountOwned : accountToAny.accountEnrolled;
    const customerErrorMessage = !!errorData ? errorData.customerErrorMessage : null;
    // ToDo Delete this work around when the traduction errors service brings an actions model object
    const serverStatusCode = (!!errorData && !!errorData.serverStatusCode ? errorData.serverStatusCode : '');
    // End ToDo
    let transactionData: TransactionResultModel = {
      type: TransactionTypes.TRANSFER,
      state,
      header: {
        showStamp: false,
        title: 'Transferencia exitosa',
        voucherId: approvalId || ''
      },
      body: {
        amtInfo: {
          amt: CurrencyFormatPipe.format(transferInfo.amount),
          amtLabel: 'Valor de la transferencia'
        },
        destination: {
          type: accountFrom.productName,
          originName: accountFrom.productBank,
          originId: `No. ${this.transactionMain.maskField(accountFrom.productNumber)}`
        },
        originAcct: `${accountTo.productName} No. ${this.transactionMain.maskField(accountTo.productNumber)}`,
        transactionCost: transferInfo.transactionCost,
        mailData: BdbConstants.EMAIL_OPTIONS.TRANSFER
      },
      controls: this.buildTransferControls(state, navController, customerErrorMessage, serverStatusCode)
    };
    if (!!transferInfo.billId || !!transferInfo.note) {
      transactionData.body.addendum = {
        note: transferInfo.note || '-',
        billId: transferInfo.billId || '-'
      };
    }
    if (state === 'error') {
      transactionData = this.transactionMain.buildErrorResult(transactionData, errorData);
    } else if (state === 'pending') {
      transactionData = this.buildPendingResult(transactionData, transferInfo.isAval);
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
          this.transactionMain.getPageNavigationFunc('NewTransferMenuPage', navController)
        );
    } else if (state === 'pending') {
      controls.controlSecondaryButton =
        this.transactionMain.getResultControl(
          'Entendido',
          this.transactionMain.getPageNavigationFunc('NewTransferMenuPage', navController)
        );
    } else if (state === 'error') {
      controls.controlMainButton =
        this.transactionMain.getResultControl('Entendido', this.transactionMain.getPageNavigationFunc('DashboardPage', navController));
      controls.controlSecondaryButton = this.transactionMain.buildErrorActions(customerErrorMessage, navController, serverStatusCode);
    }
    return controls;
  }

  private buildPendingResult(transactionData: TransactionResultModel, avalTransfer: boolean): TransactionResultModel {
    const messageInfo = avalTransfer ?
      `<span class='pulse-tp-bo3-comp-r'>Tu transferencia está siendo verficada. </span>
      <span class='pulse-tp-bo3-comp-b'>Te notificaremos el resultado de la transacción por mensaje de texto </span>
      <span class='pulse-tp-bo3-comp-r'>al celular registrado en el Banco.</span>` :
      `<span class='pulse-tp-bo3-comp-r'>Estamos esperando la confirmación del otro banco. </span>
      <span class='pulse-tp-bo3-comp-b'>Te notificaremos por mensaje de texto cuando tengamos respuesta. </span>
      <span class='pulse-tp-bo3-comp-r'>Puede tomar hasta 1 día hábil.</span>`;
    transactionData.header.title = 'Transferencia en proceso';
    transactionData.header.messageInfo = messageInfo;
    return transactionData;
  }

}

import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransactionResultModel, TransactionResultState, TransactionResultControls, TransactionTypes } from '../../models/transaction-result.model';
import { BdbMaskProvider, MaskType } from '../../../../../../providers/bdb-mask';
import { ApiGatewayError, CustomerErrorMessage } from '../../../../models/api-gateway/api-gateway-error.model';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { Pocket, PocketTransferRq } from '../../../../../root/products/pockets/models/pocket';
import { ProductDetail } from '../../../../../../app/models/products/product-model';


@Injectable()
export class TrxResultTransferPocketService {

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
    private transactionMain: TransactionResultMainService
  ) { }

  public launchResultTransfer(
    navController: NavController,
    state: TransactionResultState,
    pocketTransfer: { pocketTransferRq: PocketTransferRq, pocket: Pocket },
    approvalId?: string,
    errorData?: ApiGatewayError
  ): void {
    const pocket: Pocket = pocketTransfer.pocket;
    const account: ProductDetail = pocket.account;
    const pocketTransferRq: PocketTransferRq = pocketTransfer.pocketTransferRq;
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
          amt: this.bdbMaskProvider.maskFormatFactory(pocketTransferRq.amount, MaskType.CURRENCY),
          amtLabel: 'Valor de la transferencia'
        },
        destination:
          pocketTransferRq.transferType === BdbConstants.POCKETS.deposit ?
          {
            type: pocket.pocketName,
            originName: `Alcancía No. ${pocket.pocketId}`,
            originId: ''
          } :
          {
            type: account.productName,
            originName: account.productBank,
            originId: `No. ${this.transactionMain.maskField(account.productNumber)}`
          },
        originAcct:
          pocketTransferRq.transferType === BdbConstants.POCKETS.deposit ?
          `${account.productName} No. ${this.transactionMain.maskField(account.productNumber)}` :
          `${pocket.pocketName} Alcancía No. ${pocket.pocketId}`,
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
          this.transactionMain.getPageNavigationFunc('NewTransferMenuPage', navController)
        );
    } else if (state === 'error') {
      controls.controlMainButton =
        this.transactionMain.getResultControl('Entendido', this.transactionMain.getPageNavigationFunc('DashboardPage', navController));
      controls.controlSecondaryButton = this.transactionMain.buildErrorActions(customerErrorMessage, navController, serverStatusCode);
    }
    return controls;
  }

}

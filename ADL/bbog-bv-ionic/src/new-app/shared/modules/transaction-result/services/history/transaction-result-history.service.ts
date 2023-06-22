import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransactionResultModel, TransactionResultState, TransactionResultControls, TransactionTypes } from '../../models/transaction-result.model';
import { BdbMaskProvider, MaskType } from '../../../../../../providers/bdb-mask';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { TxHistoryModel } from '../../models/transaction-result-history.model';

@Injectable()
export class TrxResultHistoryService {

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
    private transactionMain: TransactionResultMainService
  ) { }

  public launchResultTransfer(
    navController: NavController,
    state: TransactionResultState,
    historyInfo: TxHistoryModel,
    approvalId: string,
    type: string
  ): void {
    const destinationArray = historyInfo.accountTo.acctType.split('|');
    const destination = {
      type: destinationArray[0] || '',
      originName: destinationArray[1] || '',
      originId: destinationArray[2] || '',
    };
    let transactionData: TransactionResultModel = {
      // FIX: history has different transaction types, please review state on PBBDB-2274 story
      type: type === BdbConstants.TRANSFERS_HISTORY.value ? TransactionTypes.TRANSFER : TransactionTypes.BILL_PAYMENT,
      state,
      header: {
        showStamp: type === BdbConstants.TRANSFERS_HISTORY.value ? false : true,
        title: type === BdbConstants.TRANSFERS_HISTORY.value ? 'Transferencia exitosa' : 'Pago exitoso',
        voucherId: approvalId || '',
        timestamp: { date: new Date(`${historyInfo.orderInfo.expDt} ${historyInfo.orderInfo.trnTime || ''}`), hideTime: true }
      },
      body: {
        amtInfo: {
          amt: this.bdbMaskProvider.maskFormatFactory(historyInfo.transactionCost.amt, MaskType.CURRENCY),
          amtLabel: type === BdbConstants.TRANSFERS_HISTORY.value ? 'Valor de la transferencia' : 'Valor del pago'
        },
        destination: destination,
        originAcct: historyInfo.accountFrom.acctType,
        transactionCost: historyInfo.orderInfo.transactionCost,
        mailData: BdbConstants.EMAIL_OPTIONS.TRANSFER
      },
      controls: this.buildTransferControls(state, navController)
    };
    transactionData.body.channel = historyInfo.channelInfo.channel;
    if (!!historyInfo.orderInfo.memo || historyInfo.orderInfo.billId) {
      transactionData.body.addendum = {
        note: historyInfo.orderInfo.memo || '',
        billId: historyInfo.orderInfo.billId || ''
      };
    }
    if (state === 'error') {
      transactionData = this.buildErrorData(transactionData, historyInfo);
    }
    this.transactionMain.navigateResultPage(transactionData, navController);
  }

  private buildErrorData(transactionData: TransactionResultModel, historyInfo: TxHistoryModel): TransactionResultModel {
    let messageInfo = 'La transacción no se pudo realizar.';
    if (!!historyInfo.orderInfo.desc && !(historyInfo.orderInfo.desc.toUpperCase().includes('NO EXITOSO'))) {
      messageInfo = historyInfo.orderInfo.desc;
    }
    transactionData.header.title = 'Transacción fallida';
    transactionData.header.messageInfo = messageInfo;
    return transactionData;
  }

  private buildTransferControls(state: TransactionResultState, navController: NavController): TransactionResultControls {
    const controls: TransactionResultControls = {};
    if (state === 'success') {
      controls.controlEmail =
        this.transactionMain.getResultControl('', () => {});
    }
    controls.controlSecondaryButton =
      this.transactionMain.getResultControl('Volver', this.transactionMain.getGoBackFunction(navController));
    return controls;
  }

}

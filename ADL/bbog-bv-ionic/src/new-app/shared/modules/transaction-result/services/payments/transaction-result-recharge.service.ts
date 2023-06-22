import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransactionResultModel, TransactionResultState, TransactionResultControls, TransactionTypes } from '../../models/transaction-result.model';
import { BdbMaskProvider, MaskType } from '../../../../../../providers/bdb-mask';
import { ApiGatewayError } from '../../../../models/api-gateway/api-gateway-error.model';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { ProductDetail } from '../../../../../../app/models/products/product-model';
import { RechargeInfo } from '../../../../../../app/models/recharges/recharge-info';
import { BdbMap } from '../../../../../../app/models/bdb-generics/bdb-map';

@Injectable()
export class TrxResultRechargeService {

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
    private transactionMain: TransactionResultMainService
  ) { }

  public launchResultTransfer(
    navController: NavController,
    state: TransactionResultState,
    rechargeInfo: RechargeInfo,
    approvalId?: string,
    errorData?: ApiGatewayError
  ): void {
    const carrier: BdbMap = rechargeInfo.carrier;
    const account: ProductDetail = rechargeInfo.account;
    let transactionData: TransactionResultModel = {
      type: TransactionTypes.RECHARGE,
      state,
      header: {
        showStamp: true,
        title: 'Pago exitoso',
        voucherId: approvalId || ''
      },
      body: {
        amtInfo: {
          amt: this.bdbMaskProvider.maskFormatFactory(rechargeInfo.amount, MaskType.CURRENCY),
          amtLabel: 'Valor de la recarga'
        },
        destination: {
          type: carrier.value,
          originName: 'Número celular',
          originId: `${rechargeInfo.phoneNumber}`,
        },
        originAcct: `${account.productName} No. ${this.transactionMain.maskField(account.productNumber)}`,
        transactionCost: rechargeInfo.transactionCost,
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
          this.transactionMain.getPageNavigationFunc('PaymentsMainPage', navController, { 'tab': 'recharge' })
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

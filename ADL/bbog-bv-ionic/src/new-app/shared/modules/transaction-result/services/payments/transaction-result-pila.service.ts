import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransactionResultModel, TransactionResultState, TransactionResultControls, TransactionTypes } from '../../models/transaction-result.model';
import { BdbMaskProvider, MaskType } from '../../../../../../providers/bdb-mask';
import { ApiGatewayError } from '../../../../models/api-gateway/api-gateway-error.model';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { ProductDetail } from '../../../../../../app/models/products/product-model';
import { PaymentPilaRq } from '@app/apis/payment-billers/models/payment-billers-api.model';

@Injectable()
export class TrxResultPilaService {

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
    private transactionMain: TransactionResultMainService
  ) { }

  public launchResultTransfer(
    navController: NavController,
    state: TransactionResultState,
    payPilaInfo: {
      payInfo: PaymentPilaRq,
      pilaInfo: { dataForm, billInfo, charge },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    },
    approvalId?: string,
    errorData?: ApiGatewayError
  ): void {
    const pilaInfo = payPilaInfo.pilaInfo;
    const dataForm = pilaInfo.dataForm;
    const accountSeleted = payPilaInfo.accountSeleted;
    const account: ProductDetail = accountSeleted.acct;
    let transactionData: TransactionResultModel = {
      type: TransactionTypes.BILL_PAYMENT,
      state,
      header: {
        showStamp: true,
        title: 'Pago exitoso',
        voucherId: approvalId || ''
      },
      body: {
        amtInfo: {
          amt: this.bdbMaskProvider.maskFormatFactory(pilaInfo.billInfo.bills[0].amount, MaskType.CURRENCY),
          amtLabel: 'Valor del pago'
        },
        destination: {
          type: 'Pago Pila',
          originName: dataForm.type.name,
          originId: `No. ${dataForm.ref}`,
        },
        originAcct: `${account.productName} No. ${this.transactionMain.maskField(account.productNumber)}`,
        transactionCost: pilaInfo.charge,
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
          this.transactionMain.getPageNavigationFunc('PaymentsMainPage', navController, { 'tab': 'pila' })
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

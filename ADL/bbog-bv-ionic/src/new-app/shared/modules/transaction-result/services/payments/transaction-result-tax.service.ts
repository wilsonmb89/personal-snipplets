import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransactionResultModel, TransactionResultState, TransactionResultControls, TransactionTypes } from '../../models/transaction-result.model';
import { BdbMaskProvider, MaskType } from '../../../../../../providers/bdb-mask';
import { ApiGatewayError } from '../../../../models/api-gateway/api-gateway-error.model';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { ProductDetail } from '../../../../../../app/models/products/product-model';
import { PayTaxRq } from '../../../../../../app/models/pay/tax';

@Injectable()
export class TrxResultTaxService {

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
    private transactionMain: TransactionResultMainService
  ) { }

  public launchResultTransfer(
    navController: NavController,
    state: TransactionResultState,
    payTaxInfo: {
      payInfo: PayTaxRq,
      taxInfoSel: { dataForm, taxInfo, charge },
      accountSeleted: { cardTitle, cardLabel, cardValue, isActive, acct }
    },
    approvalId?: string,
    errorData?: ApiGatewayError
  ): void {
    const taxInfoSel = payTaxInfo.taxInfoSel;
    const dataForm = taxInfoSel.dataForm;
    const taxInfo = taxInfoSel.taxInfo;
    const bill = taxInfo.bill;
    const tax = dataForm.tax;
    const accountSeleted = payTaxInfo.accountSeleted;
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
          amt: this.bdbMaskProvider.maskFormatFactory(bill.amount, MaskType.CURRENCY),
          amtLabel: 'Valor del pago'
        },
        destination: {
          type: tax.name,
          originName: `No. ${dataForm.ref}`,
          originId: '',
        },
        originAcct: `${account.productName} No. ${this.transactionMain.maskField(account.productNumber)}`,
        transactionCost: taxInfoSel.charge,
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
          this.transactionMain.getPageNavigationFunc('PaymentsMainPage', navController, { 'tab': 'tax' })
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

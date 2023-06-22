import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';

import { TransactionResultModel, TransactionResultState, TransactionResultControls, TransactionTypes } from '../../models/transaction-result.model';
import { BdbMaskProvider, MaskType } from '../../../../../../providers/bdb-mask';
import { ApiGatewayError, CustomerErrorMessage } from '../../../../models/api-gateway/api-gateway-error.model';
import { BdbConstants } from '../../../../../../app/models/bdb-generics/bdb-constants';
import { TransactionResultMainService } from '../transaction-result-main.service';
import { CashAdvanceInfo } from '../../../../../../app/models/cash-advance/cash-advance-info';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';

@Injectable()
export class TrxResultCashAdvanceService {

  constructor(
    private bdbMaskProvider: BdbMaskProvider,
    private transactionMain: TransactionResultMainService,
    private userFacade: UserFacade
  ) { }

  public launchResultTransfer(
    navController: NavController,
    state: TransactionResultState,
    cashInfo: CashAdvanceInfo,
    approvalId?: string,
    errorData?: ApiGatewayError
  ): void {
    this.getCashAdvanceCost().pipe(
      tap(cost => {
        const accountTo = cashInfo.creditCard;
        const accountFrom = cashInfo.account;
        const customerErrorMessage = !!errorData ? errorData.customerErrorMessage : null;
        // ToDo Delete this work around when the traduction errors service brings an actions model object
        const serverStatusCode = (!!errorData && !!errorData.serverStatusCode ? errorData.serverStatusCode : '');
        // End ToDo
        let transactionData: TransactionResultModel = {
          type: TransactionTypes.CREDIT_CARD_ADVANCE,
          state,
          header: {
            showStamp: false,
            title: 'Transferencia exitosa',
            voucherId: approvalId || ''
          },
          body: {
            amtInfo: {
              amt: this.bdbMaskProvider.maskFormatFactory(cashInfo.amount, MaskType.CURRENCY),
              amtLabel: 'Valor del avance'
            },
            destination: {
              type: accountFrom.productName,
              originName: accountFrom.productBank,
              originId: `No. ${this.transactionMain.maskField(accountFrom.productNumber)}`
            },
            originAcct: `${accountTo.productName} No. ${this.transactionMain.maskField(accountTo.productNumber)}`,
            transactionCost: cost,
            mailData: BdbConstants.EMAIL_OPTIONS.TRANSFER
          },
          controls: this.buildTransferControls(state, navController, customerErrorMessage, serverStatusCode)
        };
        if (state === 'error') {
          transactionData = this.transactionMain.buildErrorResult(transactionData, errorData);
        }
        this.transactionMain.navigateResultPage(transactionData, navController);
      })
    ).subscribe();
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
          this.transactionMain.getPageNavigationFunc('NewTransferMenuPage', navController, { 'tab': 'advances' })
        );
    } else if (state === 'error') {
      controls.controlMainButton =
        this.transactionMain.getResultControl('Entendido', this.transactionMain.getPageNavigationFunc('DashboardPage', navController));
      controls.controlSecondaryButton = this.transactionMain.buildErrorActions(customerErrorMessage, navController, serverStatusCode);
    }
    return controls;
  }

  private getCashAdvanceCost(): Observable<string> {
    return this.userFacade.transactionCostByType$('CASH_ADVANCE').pipe(
      map(catalogueCost => !!catalogueCost ? `Costo: ${catalogueCost}` : 'NO_AVAILABLE'),
      take(1)
    );
  }

}

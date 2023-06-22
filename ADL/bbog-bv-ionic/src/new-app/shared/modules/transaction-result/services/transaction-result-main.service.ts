import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TransactionResultModel, TransactionResultControl, TransactionResultControls } from '../models/transaction-result.model';
import { ApiGatewayError, CustomerErrorMessage } from '../../../models/api-gateway/api-gateway-error.model';
import { AvalOpsProvider } from '../../../../../providers/aval-ops/aval-ops';
import { TransactionResultHandleErrorService } from './transaction-result-handle-error.service';

@Injectable()
export class TransactionResultMainService {

  constructor(
    private avalOpsProvider: AvalOpsProvider,
    private transactionHandleError: TransactionResultHandleErrorService
  ) { }

  public getResultControl(controlLabel: string, callback: () => void): TransactionResultControl {
    return { title: controlLabel, hidden: false, action: callback };
  }

  public getPageNavigationFunc(pageName: string, navController: NavController, params: {} = {}): () => void {
    return (() => {
      navController.setRoot(pageName, params);
    });
  }

  public getGoBackFunction(navController: NavController): () => void {
    return (() => {
      if (navController.canGoBack()) {
        navController.pop();
      } else {
        navController.setRoot('DashboardPage');
      }
    });
  }

  public buildErrorResult(transactionData: TransactionResultModel, errorData: ApiGatewayError): TransactionResultModel {
    const customerErrorMessage: CustomerErrorMessage = !!errorData ? errorData.customerErrorMessage : null;
    if (!!customerErrorMessage) {
      transactionData.header.title = customerErrorMessage.title || 'Transacción fallida';
      transactionData.header.messageInfo = customerErrorMessage.message || 'En este momento la transacción no se pudo realizar. Por favor intenta más tarde.';
    } else {
      transactionData.header.title = 'Transacción fallida';
      transactionData.header.messageInfo = 'En este momento la transacción no se pudo realizar. Por favor intenta más tarde.';
    }
    return transactionData;
  }

  public maskField(field: string): string {
    return `****${field.substr(field.length - 4)}`;
  }

  public navigateResultPage(transactionData: TransactionResultModel, navController: NavController): void {
    if (transactionData.state !== 'error') {
      this.avalOpsProvider.refreshProductsInfo();
    }
    navController.push('transaction%result%page', { transactionData });
  }

  public buildErrorActions(
    customerErrorMessage: CustomerErrorMessage,
    navController: NavController,
    serverStatusCode: string = ''
  ): TransactionResultControl {
    // ToDo Delete this work around when the traduction errors service brings an actions model object
    customerErrorMessage = this.validateLimitsError(customerErrorMessage, serverStatusCode);
    // End ToDo
    let errorResultControl = this.getResultControl('Volver', this.getGoBackFunction(navController));
    if (!!customerErrorMessage && !!customerErrorMessage.actions) {
      const handlerActions =
        this.transactionHandleError.getCallToActionsCallbacks(customerErrorMessage.actions, navController);
      const redirectAction = handlerActions.find(action => action.actionName === 'redirectTo');
      if (!!redirectAction) {
        errorResultControl = {
          title: redirectAction.text,
          hidden: false,
          action: redirectAction.action
        };
      }
    }
    return errorResultControl;
  }

  /**
   * ToDo
   * Delete this work around when the traduction errors service brings an actions model object
   */
  private validateLimitsError(
    customerErrorMessage: CustomerErrorMessage,
    serverStatusCode: string
  ): CustomerErrorMessage {
    if (!!customerErrorMessage
        && (serverStatusCode === 'TS5280' || serverStatusCode === 'TS5301')) {
      customerErrorMessage.actions = {
        redirectTo: 'LIMITS'
      };
    }
    return customerErrorMessage;
  }
}

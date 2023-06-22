import { Injectable } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ModalRs } from '../../../../app/models/modal-rs/modal-rs';
import { CashAdvanceInfo } from '../../../../app/models/cash-advance/cash-advance-info';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { Card, Account } from '../../services-apis/internal-transfer/models/creditCardAdvance.model';
import { AddCreditCardAdvanceRq, AddCreditCardAdvanceRs } from '../../services-apis/internal-transfer/models/creditCardAdvance.model';
import { InternalTransferService } from '../../services-apis/internal-transfer/internal-transfer.service';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { TrxResultCashAdvanceService } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-advance.service';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';

@Injectable()
export class CreditCardAdvanceDelegateService {

  constructor(
    private internalTransferService: InternalTransferService,
    private bdbUtils: BdbUtilsProvider,
    private txResultService: TrxResultCashAdvanceService,
  ) {}

  public sendCashAdvance(cashInfo: CashAdvanceInfo, secret: string, loading: LoadingController, navCtrl: NavController): void {
    const loader = loading.create();
    loader.present();
    this.addCreditCardAdvance(cashInfo, secret).subscribe(
      (addCreditCardAdvanceRs: AddCreditCardAdvanceRs) => {
        loader.dismiss();
        const data = this.buildSuccessModalRs(addCreditCardAdvanceRs);
        this.buildResultData(cashInfo, true, data.authCode, navCtrl);
      },
      (ex) => {
        loader.dismiss();
        try {
          if (ex.status === 504 || ex.error.errorMessage.toLowerCase().match('timeout')) {
            this.launchInfoPageTimeOut(cashInfo, navCtrl);
          } else {
            this.buildResultData(cashInfo, false, '', navCtrl, ex.error ? ex.error : null);
          }
        } catch (error) {
          this.buildResultData(cashInfo, false, '', navCtrl);
        }
      }
    );
  }

  private addCreditCardAdvance(cashInfo: CashAdvanceInfo, secret: string): Observable<AddCreditCardAdvanceRs> {
    const addCreditCardAdvanceRq = this.buildCreditCardAdvanceRq(cashInfo, secret);
    return this.internalTransferService.addCreditCardAdvance(addCreditCardAdvanceRq);
  }

  private buildCreditCardAdvanceRq(cashInfo: CashAdvanceInfo, secret: string): AddCreditCardAdvanceRq {
    const card: Card = {
      id: cashInfo.creditCard.productDetailApi.productNumber,
      type: cashInfo.creditCard.productDetailApi.productBankType,
      brand: cashInfo.creditCard.productDetailApi.franchise.toUpperCase()
    };
    const account: Account = {
      id: cashInfo.account.productNumberApi,
      type: this.bdbUtils.mapTypeProduct(cashInfo.account.productType),
      subType: this.bdbUtils.mapSubtypeProduct(cashInfo.account.productType),
      bankId: BdbConstants.BBOG
    };
    const addCreditCardAdvanceRq: AddCreditCardAdvanceRq = {
      card: card,
      account: account,
      amount: Number(cashInfo.amount),
      secret: secret
    };
    return addCreditCardAdvanceRq;
  }

  private buildSuccessModalRs(addCreditCardAdvanceRs: AddCreditCardAdvanceRs): ModalRs {
    return new ModalRs(
      'pmtMdl',
      200,
      addCreditCardAdvanceRs.approvalId,
      '',
      '',
      addCreditCardAdvanceRs.message
    );
  }

  private launchInfoPageTimeOut(cashInfo: CashAdvanceInfo, navCtrl: NavController): void {
    navCtrl.push('OperationInfoPage', {
      data: {
        amount: Number(cashInfo.amount),
        amountText: 'Valor de la transferencia',
        bodyText: `Estamos presentando demoras.
                  <span class="pulse-tp-bo3-comp-b"> Si no ves reflejada la transacción
                  en los movimientos de tu cuenta en las próximas horas</span>,
                  intenta de nuevo.`,
        bodyTitle: 'Está tardando más de lo normal',
        buttonText: 'Entendido',
        dateTime: new Date().getTime(),
        image: 'assets/imgs/time-out-page/clock-warning.svg',
        title: 'Transacción en <span class="pulse-tp-hl3-comp-b">proceso</span>',
        buttonAction: () => {
          navCtrl.push('DashboardPage');
        }
      }
    });
  }

  private buildResultData(
    cashInfo: CashAdvanceInfo,
    isSuccess: boolean,
    approvalId: string = '',
    navCtrl: NavController,
    errorData?: ApiGatewayError,
  ): void {
    const state: TransactionResultState = !isSuccess ? 'error' : 'success';
    this.txResultService.launchResultTransfer(navCtrl, state, cashInfo, approvalId, errorData);
  }

}

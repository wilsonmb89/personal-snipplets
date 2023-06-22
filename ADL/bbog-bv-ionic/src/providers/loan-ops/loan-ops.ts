import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { Injectable } from '@angular/core';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { LoadingController, NavController } from 'ionic-angular';
import { FunnelEventsProvider } from '../funnel-events/funnel-events';
import { LoanTransferInfo } from '../../app/models/loan-transfer/loan-transfer-info';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { EnrollProvider } from '../enroll/enroll';
import { ApiGatewayError } from '@app/shared/models/api-gateway/api-gateway-error.model';
import { TransactionResultState } from '@app/shared/modules/transaction-result/models/transaction-result.model';
import { TrxResultLoanService } from '@app/shared/modules/transaction-result/services/transfers/transaction-result-loan.service';

@Injectable()
export class LoanOpsProvider {

  static readonly enrolledLoanType = {
    BBOG: 'bbog/payment',
    AVAL: 'aval/payment',
    CC: 'creditcard/payment'
  };

  enable = false;
  isModalOpen = false;

  constructor(
    public bdbHttpClient: BdbHttpClient,
    private bdbRsa: BdbRsaProvider,
    private bdbUtils: BdbUtilsProvider,
    private bdbMask: BdbMaskProvider,
    private funnelEvents: FunnelEventsProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private loading: LoadingController,
    private enroll: EnrollProvider,
    private txResultService: TrxResultLoanService
  ) {
  }


  public launchInfoPageTimeOut(amount: string, navCtrl: NavController): void {
    navCtrl.push('OperationInfoPage', {
      data: {
        amount: Number(amount),
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
        },
      },
    });
  }

  public buildResultData(
    loanTransfer: LoanTransferInfo,
    isSuccess: boolean,
    approvalId: string = '',
    navCtrl: NavController,
    errorData?: ApiGatewayError,
  ): void {
    const state: TransactionResultState = !isSuccess ? 'error' : 'success';
    this.txResultService.launchResultTransfer(navCtrl, state, loanTransfer, approvalId, errorData);
  }

}

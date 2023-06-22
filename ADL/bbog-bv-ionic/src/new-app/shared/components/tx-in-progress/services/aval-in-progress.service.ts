import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TxInProgressMainService } from './tx-in-progress-main.service';
import {
  TxInProgressBodyModel,
  TxInProgressBodyAmtInfoModel,
  TxInProgressHeaderModel,
  TxInProgressModel,
  TxInProgressActionButtonModel,
  TxType
} from '@app/shared/components/tx-in-progress/models/tx-in-progress.model';
import { TransferInfo } from '../../../../../app/models/transfers/transfer-info';
import { AvalInProgressData } from '../models/aval-in-progress.model';
import { BdbConstants } from '../../../../../app/models/bdb-generics/bdb-constants';

@Injectable()
export class AvalInProgressService {

  constructor(
    private txInProgressMainService: TxInProgressMainService
  ) {}

  public launchFromTransfers(transferInfo: TransferInfo, navCtrl: NavController): void {
    const modelData = this.buildFromTransfers(transferInfo, navCtrl);
    this.txInProgressMainService.launchPage<AvalInProgressData>(TxType.AvalTransfers, modelData, navCtrl);
  }

  private buildFromTransfers(transferInfo: TransferInfo, navCtrl: NavController): TxInProgressModel<AvalInProgressData> {
    const header = new TxInProgressHeaderModel(
      'assets/imgs/shared/tx-in-progress/clock-icon.svg',
      'Transferencia en proceso',
      true
    );
    const amtInfoBody = new TxInProgressBodyAmtInfoModel(
      transferInfo.amount,
      'Valor de la transferencia'
    );
    const body = new TxInProgressBodyModel(
      amtInfoBody
    );
    const action = new TxInProgressActionButtonModel(
      'Entendido',
      () => {
        navCtrl.setRoot('DashboardPage');
      }
    );
    const avalInProgressData = this.buildAvalInProgressModel(transferInfo);
    return new TxInProgressModel<AvalInProgressData>(header, body, action, avalInProgressData);
  }

  private buildAvalInProgressModel(transferInfo: TransferInfo): AvalInProgressData {
    const accountTo = transferInfo.accountTo.accountOwned || transferInfo.accountTo.accountEnrolled;
    const avalInProgressData: AvalInProgressData = {
      accountTo: {
        name: accountTo.productName,
        bankName: accountTo.productBank,
        acctInfo: `${this.checkAcctStr(accountTo.productType)} No. ${accountTo.productNumber}`
      },
      transactionCost: 'Gratis',
      accountFrom: `${this.checkAcctStr(transferInfo.account.productTypeBDB)} No. ${transferInfo.account.productNumber}`
    };
    return avalInProgressData;
  }

  private checkAcctStr(productType: string): string {
    return (
      productType.toUpperCase() === BdbConstants.SAVINGS_ACCOUNT ||
      productType.toUpperCase() === BdbConstants.ATH_SAVINGS_ACCOUNT
    ) ?
    'Ahorros' :
    'Corriente';
  }
}

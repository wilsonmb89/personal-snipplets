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
import { AchInProgressData } from '../models/ach-in-progress.model';
import { BdbConstants } from '../../../../../app/models/bdb-generics/bdb-constants';

@Injectable()
export class AchInProgressService {

  constructor(
    private txInProgressMainService: TxInProgressMainService
  ) {}

  public launchFromTransfers(transferInfo: TransferInfo, navCtrl: NavController): void {
    const modelData = this.buildFromTransfers(transferInfo, navCtrl);
    this.txInProgressMainService.launchPage<AchInProgressData>(TxType.AchTransfers, modelData, navCtrl);
  }

  private buildFromTransfers(transferInfo: TransferInfo, navCtrl: NavController): TxInProgressModel<AchInProgressData> {
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
    const achInProgressData = this.buildAchInProgressModel(transferInfo);
    return new TxInProgressModel<AchInProgressData>(header, body, action, achInProgressData);
  }

  private buildAchInProgressModel(transferInfo: TransferInfo): AchInProgressData {
    const achInProgressData: AchInProgressData = {
      accountTo: {
        name: transferInfo.accountTo.accountEnrolled.productName,
        bankName: transferInfo.accountTo.accountEnrolled.productBank,
        acctInfo: `${this.checkAcctStr(transferInfo.accountTo.accountEnrolled.productType)} No. ${transferInfo.accountTo.accountEnrolled.productNumber}`
      },
      transactionCost: transferInfo.transactionCost,
      accountFrom: `${this.checkAcctStr(transferInfo.account.productTypeBDB)} No. ${transferInfo.account.productNumber}`
    };
    return achInProgressData;
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

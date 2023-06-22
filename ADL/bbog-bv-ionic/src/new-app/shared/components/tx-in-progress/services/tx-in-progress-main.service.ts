import { Injectable } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TxInProgressModel, TxType } from '../models/tx-in-progress.model';

@Injectable()
export class TxInProgressMainService {

  private readonly CONST_ACH_IN_PROGRESS_PAGE_NAME = 'ach%in%progress';
  private readonly CONST_AVAL_IN_PROGRESS_PAGE_NAME = 'aval%in%progress';
  private readonly CONST_ACH_IN_PROGRESS_PAGE_DASHBOARD = 'page-dashboard';

  constructor() {}

  public launchPage<OriginInfo>(txType: TxType, txInProgressData: TxInProgressModel<OriginInfo>, navCtrl: NavController) {
    let pageName: string;
    switch (txType) {
      case TxType.AchTransfers:
        pageName = this.CONST_ACH_IN_PROGRESS_PAGE_NAME;
        break;
      case TxType.AvalTransfers:
        pageName = this.CONST_AVAL_IN_PROGRESS_PAGE_NAME;
        break;
      default:
        pageName = this.CONST_ACH_IN_PROGRESS_PAGE_DASHBOARD;
        break;
    }
    navCtrl.push(pageName, { txInProgressData });
  }
}

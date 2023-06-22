import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TxInProgressModel } from '@app/shared/components/tx-in-progress/models/tx-in-progress.model';
import { AchInProgressData } from '@app/shared/components/tx-in-progress/models/ach-in-progress.model';
import { Observable } from 'rxjs/Observable';
import { UserFacade } from '../../../../shared/store/user/facades/user.facade';

@IonicPage({
  name: 'ach%in%progress',
  segment: 'ach-in-progress'
})
@Component({
  selector: 'ach-in-progress',
  templateUrl: './ach-in-progress.html'
})
export class AchInProgressPage implements OnInit {

  txInProgressData: TxInProgressModel<AchInProgressData>;
  cost$: Observable<string>;

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams,
    private userFacade: UserFacade
  ) {
    this.txInProgressData = navParams.get('txInProgressData');
    if (!this.txInProgressData) {
      this.navCtrl.setRoot('DashboardPage');
    }
  }

  ngOnInit() {
    this.cost$ = this.userFacade.transactionCostByType$('ACH_TRANSFER');
  }

}

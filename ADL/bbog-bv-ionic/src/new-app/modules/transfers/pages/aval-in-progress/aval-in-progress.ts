import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TxInProgressModel } from '@app/shared/components/tx-in-progress/models/tx-in-progress.model';
import { AvalInProgressData } from '@app/shared/components/tx-in-progress/models/aval-in-progress.model';

@IonicPage({
  name: 'aval%in%progress',
  segment: 'aval-in-progress'
})
@Component({
  selector: 'aval-in-progress',
  templateUrl: './aval-in-progress.html'
})
export class AvalInProgressPage implements OnInit {

  txInProgressData: TxInProgressModel<AvalInProgressData>;

  constructor(
    private navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.txInProgressData = navParams.get('txInProgressData');
    if (!this.txInProgressData) {
      this.navCtrl.setRoot('DashboardPage');
    }
  }

  ngOnInit() {}

}

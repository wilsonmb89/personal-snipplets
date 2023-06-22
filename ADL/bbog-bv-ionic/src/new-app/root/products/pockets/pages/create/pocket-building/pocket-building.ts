import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { BdbInMemoryProvider } from '../../../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { PocketOpsService } from '../../../services/pocket-ops.service';
import { BdbToastProvider } from '../../../../../../../providers/bdb-toast/bdb-toast';
import { BdbToastOptions } from '../../../../../../../app/models/bdb-toast-options';

@IonicPage()
@Component({
  selector: 'page-pocket-building',
  templateUrl: 'pocket-building.html',
})
export class PocketBuildingPage {

  constructor(public navCtrl: NavController,
    private bdbInMemory: BdbInMemoryProvider,
    private pocketOps: PocketOpsService,
    private bdbToast: BdbToastProvider
  ) {
  }

  ionViewDidLoad() {
    this.create();
  }

  private create() {
    const initTime =  new Date().getTime();
    const dataRq = this.bdbInMemory.getItemByKey(InMemoryKeys.PocketCreateRq);
    this.pocketOps.createPocket(dataRq)
    .subscribe(data => {
      const successToast: BdbToastOptions = {
        message: 'Creación de la alcancía exitosa!',
        close: true,
        color: 'active-green',
        type: 'success'
      };
      this.bdbInMemory.clearItem(InMemoryKeys.CustomerPocketList);
      this.finish(initTime, successToast);
    }, error => {
      const errorToast: BdbToastOptions = {
        message: 'Falló la creación de la alcancía',
        close: true,
        color: 'toast-error',
        type: 'delete'
      };
      this.finish(initTime, errorToast);
    });
  }

  private finish(initTime, toast) {
    const endTime = new Date().getTime();
    const duration = endTime - initTime;
    const dif = (duration < 3000) ? 3000 - duration : 0;
    setTimeout(() => {
      this.bdbToast.showToastGeneric(toast);

      this.navCtrl.setRoot('DashboardPage');
    }, dif);
  }
}

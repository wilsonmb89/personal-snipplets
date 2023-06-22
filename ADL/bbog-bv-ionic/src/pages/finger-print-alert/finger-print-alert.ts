import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform, ViewController, ModalController } from 'ionic-angular';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { Idle } from '@ng-idle/core';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { Device } from '@ionic-native/device';
import { BdbModalProvider } from '../../providers/bdb-modal/bdb-modal';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { BdbFingerPrintProvider } from '../../providers/bdb-finger-print/bdb-finger-print';
import { FingerPrintSaveRq } from '../../app/models/finger-print-save-rq';
import { FingerPrintDevice } from '../../app/models/finger-print-device';
import { BdbInMemoryIonicProvider } from '../../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { FingerPrintSuccessPage } from '../finger-print-success/finger-print-success';
import { PageTrack } from '../../app/core/decorators/AnalyticTrack';
import { IonicApp } from 'ionic-angular';
import { BvDataApp, FingerStatus } from '../../app/models/bv-data-app';

@PageTrack({ title: 'page-finger-print-alert' })
@IonicPage()
@Component({
  selector: 'page-finger-print-alert',
  templateUrl: 'finger-print-alert.html',
})
export class FingerPrintAlertPage {

  localNavCtrl: NavController;
  activePortal;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private bdbInMemory: BdbInMemoryProvider,
    private fingerprintAIO: FingerprintAIO,
    private alertCtrl: AlertController,
    private bdbFingerPrint: BdbFingerPrintProvider,
    private ionicStorage: BdbInMemoryIonicProvider,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private _ionicApp: IonicApp,


  ) {
    this.localNavCtrl = navParams.get('navCtrl');
    if (this.platform.is('ios')) {
      this.getLoading();
      this.activePortal.dismiss();
    }

  }


  ionViewDidLoad() {
  }

  configureTouchId() {
    this.ionicStorage.get(InMemoryKeys.BvDataApp).then((result: BvDataApp) => {
      const deviceId = result.device;
      const identification = this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationNumber);
      const model = result.model;
      const rq = new FingerPrintSaveRq(deviceId, 1, identification, model);
      this.bdbFingerPrint.save(rq).subscribe((save) => {
        // save first time
        const userAuthInfo = this.bdbInMemory.getItemByKey(InMemoryKeys.UserAuthInfo);
        this.ionicStorage.set(InMemoryKeys.UserAuthInfo, userAuthInfo);
        this.ionicStorage.set(InMemoryKeys.ShowFingerInHome, true);
        const data = new BvDataApp(result.device, 'Ivan', FingerStatus.FULL, result.model);
        this.ionicStorage.set(InMemoryKeys.BvDataApp, data);
        this.viewCtrl.dismiss();
        const modal = this.modalCtrl.create('FingerPrintSuccessPage');
        modal.onDidDismiss(() => {
          this.localNavCtrl.setRoot('TabsPage');
        });
        modal.present();

      },
        (exc) => {
          this.presentAlert('Huella error!');
        });
    })
      .catch((error: any) => {   });
  }


  private presentAlert(msg) {
    const alert = this.alertCtrl.create({
      title: 'FingerPrint',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  goToHome() {

    this.ionicStorage.get(InMemoryKeys.BvDataApp).then((result: any) => {

      const data = new BvDataApp(result.device, 'Ivan', FingerStatus.NOT_CONFIG, result.model);

      this.ionicStorage.set(InMemoryKeys.BvDataApp, data);
      this.viewCtrl.dismiss();
      this.localNavCtrl.setRoot('TabsPage');
    })
      .catch((error: any) => {
        console.error(error);
      });
  }

  private getLoading() {
    this.activePortal = this._ionicApp._loadingPortal.getActive();
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { PageTrack } from '../../app/core/decorators/AnalyticTrack';

@PageTrack({ title: 'page-finger-print-success' })
@IonicPage()
@Component({
  selector: 'page-finger-print-success',
  templateUrl: 'finger-print-success.html',
})
export class FingerPrintSuccessPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appCtrl: App
  ) {
  }

  ionViewDidLoad() {
  }

  goToHome() {
    this.viewCtrl.dismiss();
  }

}

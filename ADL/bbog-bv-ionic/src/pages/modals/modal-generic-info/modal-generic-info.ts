import { Component, Input } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';
import { ModalGenericInfo } from '../../../providers/bdb-modal/bdb-modal';

@IonicPage()
@Component({
  selector: 'page-modal-generic-info',
  templateUrl: 'modal-generic-info.html',
})
export class ModalGenericInfoPage {

  data: ModalGenericInfo;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.data = navParams.get('data');
  }

  ionViewDidLoad() { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

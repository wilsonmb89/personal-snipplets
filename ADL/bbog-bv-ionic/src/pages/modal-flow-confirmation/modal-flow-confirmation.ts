import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-flow-confirmation',
  templateUrl: 'modal-flow-confirmation.html',
})
export class ModalFlowConfirmationPage {

  data: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.data = navParams.get('data');
  }

  ionViewDidLoad() { }

  onCancel() {
    this.viewCtrl.dismiss();
  }

}

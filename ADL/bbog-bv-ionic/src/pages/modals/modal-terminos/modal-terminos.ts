import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-terminos',
  templateUrl: 'modal-terminos.html',
})
export class ModalTerminosPage {

  title: string;
  message: string;

  constructor(
    public view: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillLoad() {
    this.title = this.navParams.get('title');
    this.message = this.navParams.get('message');
  }

  closeModal() {
    this.view.dismiss();
  }

}

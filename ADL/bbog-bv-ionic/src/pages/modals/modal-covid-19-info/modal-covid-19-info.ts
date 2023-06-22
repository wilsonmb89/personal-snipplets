import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-modal-covid-19-info',
  templateUrl: 'modal-covid-19-info.html',
})
export class ModalCovid19InfoPage {

  CONST_URL_ALIVIO_CREDITICIO = 'https://digital.bancodebogota.com/aliviofinanciero/index.html?utm_source=usuarios-portal&utm_medium=referido&utm_campaign=covid&utm_content=alivio-economico#xd_co_f=MGZmYzQzOWMtNmFhMi00NDIwLThlOTUtNjY3MGFiMjA5MTE3~';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) { }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  openBankUrl() {
    window.open(this.CONST_URL_ALIVIO_CREDITICIO, '_blank');
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VoucherButton, VoucherInfo, VoucherData, VoucherText, VoucherDetail, VoucherError } from '../../app/models/voucher/voucher-data';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';

@IonicPage()
@Component({
  selector: 'page-voucher-window',
  templateUrl: 'voucher-window.html',
})
export class VoucherWindowPage {

  voucherText: Array<VoucherText> = [{ value: '' }];
  voucherDetail: Array<VoucherDetail> = [{ name: '', text: this.voucherText }];
  voucherInfo: VoucherInfo = { number: '1', date: '01/01/01', content: this.voucherDetail };

  data: VoucherData = {
    successful: true, voucher: this.voucherInfo,
    err: { title: '', message: '' }
  };

  btn1: VoucherButton = {
    id: 'voucherClose',
    name: 'Cerrar',
    func: () => {
      window.close();
    },
    type: 'outline',
    color: 'bdb-blue'
  };

  btn2: VoucherButton = {
    id: 'voucherPrint',
    name: 'Imprimir',
    func: () => {
      window.print();
    }
  };

  buttons: Array<VoucherButton> = [this.btn1, this.btn2];
  viewSendEmail = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider
  ) {
  }

  ionViewDidLoad() {
    this.data = this.bdbInMemory.getItemByKey(InMemoryKeys.VoucherWindow);
  }

}

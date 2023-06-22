import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { VoucherData, VoucherInfo, VoucherDetail, VoucherText, VoucherButton } from '../../app/models/voucher/voucher-data';
import { EmailProvider } from '../../providers/messenger';
import { Events } from 'ionic-angular';
import { BdbPlatformsProvider } from '../../providers/bdb-platforms/bdb-platforms';
import { PageTrack } from '../../app/core/decorators/AnalyticTrack';

@PageTrack({
  title: 'page-voucher'
})
@IonicPage()
@Component({
  selector: 'page-voucher',
  templateUrl: 'voucher.html',
})
export class VoucherPage {

  data: VoucherData;
  buttons: Array<VoucherButton> = [];
  emailOptions: string;
  viewSendEmail = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private emailProvider: EmailProvider,
    private toastCtrl: ToastController,
    private events: Events,
    private viewCtrl: ViewController,
    private bdbPlatforms: BdbPlatformsProvider
  ) {
    this.data = navParams.get('data');
    this.buttons = navParams.get('buttons');
    this.emailOptions = navParams.get('emailOptions');

    // subscribe to closure event
    events.subscribe('voucher:close', () => {
      this.viewCtrl.dismiss();
    });
  }

  ionViewDidLoad() {
  }

  popFlow() {
    this.navCtrl.pop();
  }

  triggerSendEmail() {
    this.viewSendEmail = !this.viewSendEmail;
  }

  submitSendEmail(email: string) {
    this.emailProvider.sendMailVoucher(this.data, email, this.emailOptions).subscribe(
      data => {

        const toast = this.toastCtrl.create({
          message: 'Comprobante enviado con éxito a tu e-mail.',
          duration: 3000,
          cssClass: 'toast-voucher',
          showCloseButton: true,
          closeButtonText: 'X',
          position: !this.bdbPlatforms.isBrowser() ? 'top' : 'bottom'
        });
        toast.present();
      },
      err => {
        console.error('No Enviado', err);
      }
    );
  }

  btnClick(event) {
    event.func(this.navCtrl);
  }

}

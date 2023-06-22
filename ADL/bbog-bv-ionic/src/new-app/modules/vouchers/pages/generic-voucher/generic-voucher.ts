import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import {PageTrack} from '../../../../../app/core/decorators/AnalyticTrack';
import {BdbPlatformsProvider} from '../../../../../providers/bdb-platforms/bdb-platforms';
import {NavigationProvider} from '../../../../../providers/navigation/navigation';
import {VoucherButton, VoucherData} from '../../../../../app/models/voucher/voucher-data';
import {EmailProvider} from '../../../../../providers/messenger';
import {InMemoryKeys} from '../../../../../providers/storage/in-memory.keys';
import {BdbInMemoryProvider} from '../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import {TooltipOpsProvider} from '../../../../../providers/tooltip-ops/tooltip-ops';
import {TooltipOptions} from '../../../../../app/models/tooltip-options';
import {BdbConstants} from '../../../../../app/models/bdb-generics/bdb-constants';

@PageTrack({
  title: 'generic-page-generic-voucher'
})
@IonicPage()
@Component({
  selector: 'generic-page-voucher',
  templateUrl: 'generic-voucher.html',
})
export class GenericVoucherPage {

  @ViewChild('ppalContainer') ppalContainer;
  private data: VoucherData;
  private buttons: Array<VoucherButton> = [];
  private emailOptions: string;
  private viewSendEmail = false;
  private tab: string;
  @ViewChild('sendMail') sendMail;
  private showCookie: boolean;
  private withLogout = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private genericEmailService: EmailProvider,
    private toastCtrl: ToastController,
    private events: Events,
    private viewCtrl: ViewController,
    private bdbPlatforms: BdbPlatformsProvider,
    public navigation: NavigationProvider,
    public bdbInMemory: BdbInMemoryProvider,
    private tooltipOps: TooltipOpsProvider
  ) {

    const params = this.bdbInMemory.getItemByKey(InMemoryKeys.VoucherWindow);
    this.data = params.data;
    this.buttons = params.buttons;
    this.emailOptions = params.emailOptions;
    this.tab = params.tab;
    this.withLogout = params.withLogout;
    // subscribe to closure event
    events.subscribe('generic-voucher:close', () => {
      this.viewCtrl.dismiss();
    });
  }

  ionViewDidEnter() {
    this.ppalContainer.nativeElement
      .addEventListener('scroll', () => this.tooltipOps.recalcTooltip());
  }

  ionViewDidLoad() {
    this.events.publish('srink', true);
    this.showCookie = this.tooltipOps.validateCookie();
    if (this.showCookie && this.sendMail) {
      this.loadSendMailTooltip();
    }
  }

  ionViewWillLeave() {
    this.tooltipOps.removeAllTooltip();
  }

  popFlow() {
    this.navCtrl.pop();
  }

  private triggerSendEmail(): void {
    this.viewSendEmail = !this.viewSendEmail;
  }

  private submitSendEmail(email: string): void {
    this.genericEmailService.sendMailVoucher(this.data, email, this.emailOptions).subscribe(
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

  onBackPressed() {
    this.navCtrl.setRoot(this.tab === BdbConstants.TRANSFERS_HISTORY.label ? 'NewTransferMenuPage' : 'PaymentsMainPage', {
      tab: 'history'
    }, {
    });
  }

  onLogout() {
    this.navCtrl.push('authentication/logout');
  }

  public goPreviousPage(): void {
    this.navigation.onBackPressed(this.navCtrl);
  }

  private loadSendMailTooltip(): void {
    const pos = this.getTooltipPositions(window.innerWidth);
    if (!!pos) {
      const options: TooltipOptions = {
        objectdesthtml: this.sendMail.nativeElement,
        color: 'primary',
        tiptitle: 'Envía tu comprobante:',
        description: 'Aquí podrás enviar una copia a un correo electrónico.',
        elevation: 4,
        colorvariant: '400',
        position: pos.sendMailtooltip,
        id: 'sendMailtooltip'
      };
      this.tooltipOps.presentToolTip(options).subscribe((id) => {
        this.tooltipOps.assignElements(id);
      });
    }
  }

  private getTooltipPositions(width): { sendMailtooltip: string } {
    if (width > 991) {
      return {
        sendMailtooltip: 'top-start'
      };
    }
  }

}

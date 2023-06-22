import { Injectable } from '@angular/core';
import {Toast, ToastController} from 'ionic-angular';
import { BdbPlatformsProvider } from '../../providers/bdb-platforms/bdb-platforms';
import { BdbToastOptions } from '../../app/models/bdb-toast-options';
import { ToastOptions } from 'ionic-angular';

@Injectable()
export class BdbToastProvider {

  duration = 5000;
  toast: Toast;

  constructor(
    public toastCtrl: ToastController,
    public bdbPlatforms: BdbPlatformsProvider
  ) { }

  showToast(msg: string) {

    try {
      this.toast.dismissAll();
    } catch (e) {
    }

   this.toast  = this.toastCtrl.create({
      message: msg,
      duration: this.duration,
      cssClass: 'toast-voucher',
      showCloseButton: true,
      closeButtonText: 'X',
    });
    this.toast.present();
  }

  showToastV2(msg: string, toastClass: string, closeButtonText, f: () => void) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: this.duration,
      cssClass: toastClass,
      showCloseButton: true,
      closeButtonText,
    });
    toast.onDidDismiss((data, role) => {
      if (role === 'close') {
        f();
      }
    });
    toast.present();
  }

  showToastAction(msg: string, closeButtonText: any, f: () => void, duration = 3000, executeOnDismiss = false) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration,
      closeButtonText,
      showCloseButton: true,
      dismissOnPageChange: true
    });
    toast.onDidDismiss((data, role) => {
      if (role === 'close' || executeOnDismiss) {
        f();
      }
    });
    toast.present();
  }

  showToastGeneric(bdbOpts: BdbToastOptions) {

  try {
      this.toast.dismissAll();
    } catch (e) {
    }

    const toastOptions: ToastOptions = {
      message: bdbOpts.message,
      cssClass: 'bdb-toast-generic',
      duration: this.duration,
      showCloseButton: !!bdbOpts.close ? bdbOpts.close : false,
      closeButtonText: !!bdbOpts.closeText ? bdbOpts.closeText : 'X',
    };

    if (!!bdbOpts.type) {
      toastOptions.cssClass = toastOptions.cssClass.concat(' ' + bdbOpts.type);
    }

    if (!!bdbOpts.color) {
      toastOptions.cssClass = toastOptions.cssClass.concat(' ' + bdbOpts.color);
    }

    this.toast = this.toastCtrl.create(toastOptions);
    this.toast.present();
  }

}

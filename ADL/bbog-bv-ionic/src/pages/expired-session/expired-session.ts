import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicApp } from 'ionic-angular';
import { PageTrack } from '../../app/core/decorators/AnalyticTrack';
import { SessionProvider } from '../../providers/authenticator/session';
import {AuthFacade} from '@app/shared/../../new-app/modules/authentication/store/facades/auth.facade';
import {BdbModalProvider} from '../../providers/bdb-modal/bdb-modal';

/**
 * Generated class for the ExpiredSessionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@PageTrack({ title: 'page-expired-session' })
@IonicPage()
@Component({
  selector: 'page-expired-session',
  templateUrl: 'expired-session.html',
})
export class ExpiredSessionPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    readonly _ionicApp: IonicApp,
    private authenticationFacade: AuthFacade,
    public bdbModalProvider: BdbModalProvider

  ) {
  }

  ionViewDidEnter() {
    this.closeModals();
    this.authenticationFacade.sessionExpired();
  }

  returnApp() {
    this.navCtrl.push('authentication/logout');
  }

  private closeModals() {
    const activePortal =
      this._ionicApp._modalPortal.getActive() ||
      this._ionicApp._toastPortal.getActive() ||
      this._ionicApp._overlayPortal.getActive();
      this.bdbModalProvider.closeModal();
    if (!!activePortal) {
      activePortal.dismiss();
    }
  }
}

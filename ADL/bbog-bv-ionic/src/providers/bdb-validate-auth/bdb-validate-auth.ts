import { Injectable } from '@angular/core';
import { BdbModalProvider } from '../bdb-modal/bdb-modal';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { NavigationProvider } from '../navigation/navigation';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { Platform, ModalController } from 'ionic-angular';
import { AuthenticatorProvider } from '../authenticator/authenticator';
import { UserLastConnectRq } from '../../app/models/user-last-connect';
import { ENV } from '@app/env';
import { FingerStatus } from '../../app/models/bv-data-app';

@Injectable()
export class BdbValidateAuthProvider {

  constructor(
    private navigation: NavigationProvider,
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private bdbModal: BdbModalProvider,
    private authenticatorProvider: AuthenticatorProvider,
    public plt: Platform,
    private modalCtrl: ModalController,
  ) {
  }





  public setUserDataStorageAccessToken(accessToken: string) {
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.AccessToken, accessToken);
  }

  public setUserDataStoragereferenceId(referenceId: string) {
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.ReferenceId, referenceId);
  }

  setLastConnect(identificationType, identificationNumber) {
    const tmpUser: UserLastConnectRq = new UserLastConnectRq();
    tmpUser.id = identificationType + identificationNumber.toString();
    tmpUser.ip = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.IP);
    tmpUser.info = window.navigator.userAgent;
    tmpUser.device = this.plt.platforms()[0];
    tmpUser.connectDate = +new Date();
    this.authenticatorProvider.setLastConnect(tmpUser)
      .subscribe(e => {
      }, error => {
        console.error('error set connect');
      });
  }

  public flowFingerValidate(fingerStatus, localNavCtrl) {
    // emporalmente se deshabilita mientras se termina la refactorizacion del finger
    if (FingerStatus.FOR_CONFIG === fingerStatus && ENV.STAGE_NAME === 'dev') {
      const modal = this.modalCtrl.create('FingerPrintAlertPage', {
        navCtrl: localNavCtrl
      });
      modal.present();
    } else {
      localNavCtrl.setRoot('MasterPage');
    }

  }


}

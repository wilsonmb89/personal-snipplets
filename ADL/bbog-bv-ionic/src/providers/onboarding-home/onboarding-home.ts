import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BdbCookies } from '../bdb-cookie/bdb-cookie';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { BdbCryptoProvider } from '../bdb-crypto/bdb-crypto';
import { ModalOptions, ModalController } from 'ionic-angular';
import { ENV } from '@app/env';

@Injectable()
export class OnboardingHomeProvider {

  identificationNumber: string;

  constructor(
    public http: HttpClient,
    private bdbCookies: BdbCookies,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbCrypto: BdbCryptoProvider,
    private modalCtrl: ModalController
  ) {
    this.identificationNumber = bdbInMemory.getItemByKey(InMemoryKeys.IdentificationNumber);
  }

  isViewOnboarding() {

    const usersArray = this.getUsersArray();
    const exist = usersArray.filter((e: string) => {
      return e === this.identificationNumber;
    });

    if (exist.length > 0) {
      return;
    }

    const modalOptions: ModalOptions = {
      enableBackdropDismiss: false,
      cssClass: 'onboarding-home'
    };

    const modal = this.modalCtrl.create('OnboardingHomePage', {}, modalOptions);
    modal.onDidDismiss(() => { });
    modal.present();
  }

  getUsersArray(): Array<string> {
    const usersCookie = this.bdbCookies.getCookie(InMemoryKeys.ViewOnboarding);
    return usersCookie === '' || !this.isJson(usersCookie) ? [] : JSON.parse(usersCookie);
  }

  setUserInCookie() {
    const usersArray = this.getUsersArray();
    usersArray.push(this.identificationNumber);
    this.bdbCookies.setCookie(InMemoryKeys.ViewOnboarding, JSON.stringify(usersArray), 365);
  }

  isJson(str): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

}

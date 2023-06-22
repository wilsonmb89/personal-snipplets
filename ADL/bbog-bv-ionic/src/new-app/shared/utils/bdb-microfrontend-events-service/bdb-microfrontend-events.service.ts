import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { App, LoadingController } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BdbCryptoForgeProvider } from '../../../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { EventTypes, sessionStorageKeys, sessionStorageTypes } from './bdb-microfrontend-events.types';

@Injectable()
export class BdbMicrofrontendEventsService {
  public externalRoute$: Observable<any>;
  private redirecteredToExternalRoute = false;
  private externalRouteSubject$: Subject<any>;

  constructor(
    private bdbCryptoForgeProvider: BdbCryptoForgeProvider,
    private appCtrl: App,
    private loadingCtrl: LoadingController
  ) {
    this.externalRouteSubject$ = new Subject();
    this.externalRoute$ = this.externalRouteSubject$.asObservable();

    window.addEventListener('popstate', () => {
      if (this.redirecteredToExternalRoute) {
        this.sendRouteEventToParentWindow('/dashboard');
        this.redirecteredToExternalRoute = false;
      }
    });
    window.addEventListener('message', ({ origin, data }) => {
      if (origin + '/' !== ENV.MICROFRONTEND_SHELL_ORIGIN) {
        return;
      }
      if (data && data.event === 'NAVIGATION') {
        const navCtrl = this.appCtrl.getActiveNav();
        const loader = this.loadingCtrl.create();
        loader.present().then(() => {
          try {
            const route = data.route;
            this.externalRouteSubject$.next(route);
            if (route.name === navCtrl.getActive().id) {
              loader.dismiss();
              return;
            }
            navCtrl.setRoot(route.name, {[route.paramKey]: route.paramValue}, {}, () => loader.dismiss());
          } catch (error) {
            loader.dismiss();
          }
        });
      }
    });
  }

  sendRouteEventToParentWindow(route: string): void {
    this.redirecteredToExternalRoute = true;
    this.sendEventToParentWindow('NAVIGATION', { route });
  }

  sendLoginEventToParentWindow(): void {
    this.sendEventToParentWindow('LOGIN', {});
  }

  sendTopNavigationEventToParentWindow(route: string): void {
    this.sendEventToParentWindow('TOP_NAVIGATION', { route });
  }

  sendLogoutEventToParentWindow(): void {
    this.sendEventToParentWindow('LOGOUT', {});
  }

  sendStartEventToParentWindow(): void {
    this.sendEventToParentWindow('START', {});
  }

  saveStateInSessionStorage<T extends sessionStorageTypes>(key: sessionStorageKeys, data: T) {
    try {
      sessionStorage.setItem(btoa(key), this.bdbCryptoForgeProvider.encrypt(data));
    } catch (error) {
      console.log('Error trying to set session variable', error);
    }
  }

  private sendEventToParentWindow(event: EventTypes, data: any): void {
    if (window.parent) {
      window.parent.postMessage({ app: 'MF_LEGACY', event, data }, ENV.MICROFRONTEND_SHELL_ORIGIN);
    }
  }
}

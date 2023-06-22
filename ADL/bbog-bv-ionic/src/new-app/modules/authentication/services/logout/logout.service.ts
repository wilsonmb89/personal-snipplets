import { Injectable } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { App } from 'ionic-angular';
import { InMemoryKeys } from '../../../../../providers/storage/in-memory.keys';
import { BdbInMemoryProvider } from '../../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import {filter, take} from 'rxjs/operators';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';

export const WARNNING_TIME_SESSION = 30;
export const TIMEOUT_SESSION = 600;
export const EXCLUDED_PAGES = [
  'login',
  'LoginPage',
  'PbLandingPage',
  'loginweb',
  'ExpiredSessionPage',
  'BlockPlatformPage',
  'authentication/logout'
];

@Injectable()
export class BdbLogoutService {
  constructor(
    private idle: Idle,
    private appCtrl: App,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService
  ) {
    this.initRouteGuard();
  }

  initSessionTimeout(): void {
    this.idle.setIdle(TIMEOUT_SESSION - WARNNING_TIME_SESSION);
    this.idle.setTimeout(WARNNING_TIME_SESSION);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onTimeoutWarning.pipe(take(1)).subscribe((countdown: number) => this.resetTimerOnExcludedPages());
    this.idle.onTimeout.pipe(take(1)).subscribe(() => this.appCtrl.getRootNav().push('ExpiredSessionPage'));
    this.resetSessionTimeout();
  }

  resetSessionTimeout(): void {
    this.idle.watch();
  }

  logout(): void {
    this.bdbInMemory.clearAll();
    this.resetSessionTimeout();
    this.appCtrl.getRootNav().setRoot('LoginPage');
    this.bdbMicrofrontendEventsService.sendLogoutEventToParentWindow();
  }

  sessionExpired(): void {
    this.bdbInMemory.clearAll();
    this.resetSessionTimeout();
    this.bdbMicrofrontendEventsService.sendLogoutEventToParentWindow();
  }

  private resetTimerOnExcludedPages(): void {
    const currentPage = this.appCtrl.getRootNav().getActive().id;
    // TODO: remove "any" when typescript dependencies be updated.
    if ((EXCLUDED_PAGES as any).includes(currentPage)) {
      this.resetSessionTimeout();
    }
  }

  private initRouteGuard (): void {
    this.appCtrl.viewDidEnter
      .pipe(filter(view => !view.id.includes('n2-') ))
      .subscribe(view => {
        const accessToken = this.bdbInMemory.getItemByKey(InMemoryKeys.AccessToken);
        if ((!(EXCLUDED_PAGES as any).includes(view.id) && !accessToken)) {
          this.logout();
        }
    });
  }
}

import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Events, IonicApp, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// finger
import { ConfigAppProvider } from '../providers/config-app/config-app';
import { DataToLogin } from './models/bv-data-app';

// Timeout
import { SessionProvider } from '../providers/authenticator/session';
import { BdbInMemoryProvider } from '../providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbPlatformsProvider } from '../providers/bdb-platforms/bdb-platforms';
import { InMemoryKeys } from '../providers/storage/in-memory.keys';
import { ENV } from '@app/env';
import { BdbCookies } from '../providers/bdb-cookie/bdb-cookie';
import { WebSocketSessionProvider } from '../providers/web-socket-session/web-socket-session';
import { BdbAnalyticsService } from '../new-app/shared/utils/bdb-analytics-service/bdb-analytics.service';
import { LoadScriptService } from '../new-app/shared/utils/bdb-load-script-service/load-script.service';
import {AuthFacade} from '@app/modules/authentication/store/facades/auth.facade';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {

  @ViewChild(Nav) nav: Nav;
  private pageHome = 'LoginPage';
  private pageHomeParam;

  @HostListener('window:beforeunload')
  onBeforeunload() {
    this.wsSessionProvider.wsSessionClosed();
  }

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    readonly config: ConfigAppProvider,
    public events: Events,
    public session: SessionProvider,
    private bdbPlatform: BdbPlatformsProvider,
    private bdbInMemory: BdbInMemoryProvider,
    readonly _ionicApp: IonicApp,
    readonly bdbCookie: BdbCookies,
    private wsSessionProvider: WebSocketSessionProvider,
    private loadScriptService: LoadScriptService,
    private bdbGtmService: BdbAnalyticsService,
     private authenticationFacade: AuthFacade,
    private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService
  ) {

    setTimeout(() => {
      if (this.bdbPlatform.isCallBlockPlatform()) {
        this.pageHome = 'BlockPlatformPage';
      }
    }, 800);


    this.bdbInMemory.setItemByKey(InMemoryKeys.IP, '127.0.0.1');

    platform.ready().then(() => {
      this.initPageSelection();
      this.authenticationFacade.initSessionTimeout();
    });
  }

  ngOnInit(): void {
    this.buildUUID();
    this.filterCOnsole();
    this.loadScriptService.loadCyxteraScript();
    this.loadScriptService.addScriptTealium();
    this.bdbGtmService.initAnalytics();
    this.bdbMicrofrontendEventsService.sendStartEventToParentWindow();
  }

  public filterCOnsole() {
    console.log('%cDetente!', 'color: red; font-weight: bolder, text-shadow: 0px 0px 4px #CB5800; font-size: 36px');
    const orig = console.log;

    console.log = function () {
      if (ENV.STAGE_NAME !== 'pr') {
        orig.apply(console, arguments);
      }
    };
  }

  buildUUID() {
    if (this.bdbCookie.checkCookie(InMemoryKeys.UUID_THREAT)) {
      this.bdbInMemory.setItemByKey(InMemoryKeys.UUID_THREAT, this.bdbCookie.getCookie(InMemoryKeys.UUID_THREAT));
    } else {
      this.bdbInMemory.setItemByKey(InMemoryKeys.UUID_THREAT, null);
      this.bdbCookie.setCookie(InMemoryKeys.UUID_THREAT, null, 365);
    }
  }

  private initPageSelection() {
    this.config.dataStorageAction().then((a: DataToLogin) => {
      this.bdbInMemory.setItemByKey(InMemoryKeys.DataToLogin, a);

      const versionIE: any = this.bdbPlatform.detectIE();

      if (versionIE === false || versionIE >= 12) {
        this.pageHome = a.page;
      } else {
        this.pageHome = 'BlockPlatformPage';
      }

    });
  }
}

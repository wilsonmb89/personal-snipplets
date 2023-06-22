import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { SessionProvider } from '../../../providers/authenticator/session';
import { ModelTab } from '../../../providers/tabs/model-tab';
import { TabsProvider } from '../../../providers/tabs/tabs';
import { AutoResizeDirective } from '../../../directives/auto-resize/auto-resize';
import * as menuJson from '../../../components/navbar-side/navbar-side.json';
import { AccessDetailProvider } from '../../../providers/access-detail/access-detail';
import { expandRow } from '../../../components/core/utils/animations/transitions';
import { InMemoryKeys } from '../../../providers/storage/in-memory.keys';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';

@IonicPage({
  segment: 'master'
})
@Component({
  selector: 'page-master',
  templateUrl: 'master.html',
  animations: [expandRow]
})
// tslint:disable-next-line:component-class-suffix
export class MasterPage {

  @ViewChild('rootNav', { read: ElementRef }) navContent: ElementRef;
  @ViewChild('pulseTabs', { read: ElementRef }) pulseTabs: ElementRef;

  masterPage = 'DashboardPage';
  itemsTab: Array<ModelTab>;
  itemsMenu = [];
  currentBreakPoint;
  shrink = false;

  showTabs = true;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeContent();
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public event: Events,
    private _app: App,
    public bdbInMemoryProvider: BdbInMemoryProvider,
    private tabsProvider: TabsProvider,
    private session: SessionProvider,
    private accessDetail: AccessDetailProvider,
    private bdbMicrofrontendEventsService: BdbMicrofrontendEventsService,
    private userFacade: UserFacade
  ) {
    this.initializeApp();
    /* this event updates the enable state of the clickable elements of the menu side bar */
    event.subscribe('menu:products', (value: boolean) => {
      this.itemsTab.forEach(e => {
        e.enabled = value;
      });
      this.itemsMenu.forEach(e => {
        e.enabled = value;
      });
    });

    /* this event updates the active element in the menu side bar */
    event.subscribe('menu:active', (page: string) => {
      this.setActiveTab(page);
    });

    event.subscribe('master:page', (page: string) => {
      this.navigateWeb(page);
    });

    event.subscribe('srink', (shrink: boolean) => {
      this.shrink = shrink;
      if (!!this.pulseTabs && !!this.navContent) {
        if (this.showTabs && shrink) {
          this.pulseTabs.nativeElement.style.height = 0;
          this.navContent.nativeElement.style.height = window.innerHeight + 'px';
        } else if (this.showTabs && !shrink) {
          this.pulseTabs.nativeElement.style.height = 76 + 'px';
          this.navContent.nativeElement.style.height = (window.innerHeight - 76) + 'px';
        }
      }
    });
    if (!this.isUserLoggedIn() && !window.location.hash.includes('/login')) {
      setTimeout(() => {
        this.navCtrl.push('authentication/logout');
        this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow('/');
      }, 2000);
    }
  }

  ionViewWillEnter() {
    this.tabDidLoad();
  }

  navigateWeb(page) {
    this.navCtrl.getActiveChildNav().push(page);
    this.clearMicrofrontends();
  }

  resizeContent() {
    const newBreakPoint = AutoResizeDirective.asignBreakPoint(window.innerWidth);
    if (newBreakPoint !== this.currentBreakPoint) {
      this.currentBreakPoint = newBreakPoint;
      this.tabDidLoad();
    }
  }

  initializeApp() {
    this.userFacade.getPublicKey();
    this.itemsTab = this.tabsProvider.get();
    this.getMenu();
    this.currentBreakPoint = AutoResizeDirective.asignBreakPoint(window.innerWidth);

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();

      // this.itemsTab[0].active = true;
    });
  }

  getMenu() {
    const array = menuJson;
    Object.assign(this.itemsMenu, array);
  }

  tabDidLoad() {
    const h = this.getNavHeight(window.innerWidth);
    this.navContent.nativeElement.style.height = h + 'px';
  }

  getNavHeight(iWidth): number {
    if (iWidth >= 768) {
      this.showTabs = false;
      return window.innerHeight;
    } else {
      this.showTabs = true;
      const windowH = window.innerHeight;
      return !!this.pulseTabs ? (windowH - this.pulseTabs.nativeElement.clientHeight) : windowH;
    }
  }

  setActiveTab(pageTitle: string) {
    this.itemsTab.forEach(e => e.active = false);
    this.itemsMenu.forEach(e => e.active = false);
    if (pageTitle !== 'settings%app') {
      const tab = this.itemsTab.find(q => q.tab === pageTitle);
      tab.active = true;
    }
    const item = this.itemsMenu.find(p => p.page === pageTitle);
    item.active = true;
  }

  ionViewDidEnter() {
    this._app.setTitle('Banca Virtual BdB');
  }

  ionViewCanEnter() {
    return this.session.authenticated();
  }

  navigate(itemTab) {
    this.itemsTab.forEach(e => e.active = false);
    itemTab.active = true;
    this.navCtrl.getActiveChildNav().setRoot(itemTab.tab);
    this.clearMicrofrontends();
  }

  onMenuClick(event, origin?: boolean) {
    if (!origin) {
      this.accessDetail.unselectedOrigin();
    }
    this.navCtrl.getActiveChildNav().setRoot(event.page);
    this.clearMicrofrontends();
  }

  private clearMicrofrontends(): void {
    setTimeout(() => this.bdbMicrofrontendEventsService.sendRouteEventToParentWindow('/dashboard'), 100);
  }

  private isUserLoggedIn(): boolean {
    const accessToken = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.AccessToken);
    return !!accessToken;
  }
}

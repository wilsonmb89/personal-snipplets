import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DocsOpsMenuProvider } from '../../../providers/docs-ops-menu/docs-ops-menu';
import { FunnelEventsProvider } from '../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../providers/navigation/navigation';
import { TabsMenuProvider } from '../../../providers/tabs-menu/tabs-menu';
import { DefaultViewMenuComponent } from '../../../components/default-view-menu/default-view-menu';
import { SessionProvider } from '../../../providers/authenticator/session';
import { PageTrack } from '../../../app/core/decorators/AnalyticTrack';
import { Events } from 'ionic-angular';

@PageTrack({ title: 'documents-menu' })
@IonicPage({
  segment: 'documents-main'

})
@Component({
  selector: 'page-docs-menu',
  templateUrl: 'docs-menu.html',
})
export class DocsMenuPage implements OnInit {

  private title = 'Documentos';
  public tabs = [];
  private _menu = this.funnelKeysProvider.getKeys().menu;
  @ViewChild('target', { read: ViewContainerRef }) target;
  hideSpinner = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private nav: NavigationProvider,
    private docsOpsMenu: DocsOpsMenuProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private tabsMenuProvider: TabsMenuProvider,
    private componentFactoryResolver: ComponentFactoryResolver,
    private events: Events
  ) {
    this._menu = this.funnelKeysProvider.getKeys().menu;
    this.tabs = this.docsOpsMenu.tabsData();
  }

  ionViewWillEnter() {
    this.funnelEventsProvider.callFunnel(this._menu, this._menu.steps.payments);
    this.events.publish('menu:active', 'DocsMenuPage');
    this.events.publish('srink', false);
  }

  ngOnInit() {
    this.mapTabs(this.tabs[0]);
  }

  changeTab(tab) {
    this.mapTabs(tab);
  }

  mapTabs(tab) {
    tab.active = true;
    this.tabsMenuProvider.openTab(
      tab,
      this.target,
      this.componentFactoryResolver,
      (e) => {
        if (tab.component === DefaultViewMenuComponent) {
          const instance: DefaultViewMenuComponent = e.instance as DefaultViewMenuComponent;
          instance.message = tab.empty.message;
          instance.img = tab.empty.img;
          instance.button = tab.empty.button;
        }
      }
    );
  }

  onBackPressed() {
    this.nav.onBackPressed(this.navCtrl);
  }

  onLogout() {
    this.navCtrl.push('authentication/logout');
  }

}

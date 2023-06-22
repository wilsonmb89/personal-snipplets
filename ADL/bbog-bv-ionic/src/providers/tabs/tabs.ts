import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import * as iconTabs from './icon-tabs.json';
import { ModelTab } from './model-tab';

@Injectable()
export class TabsProvider {

  itemsTab: Array<ModelTab> = [
    {
      index: 0,
      type: 'home',
      title: 'Productos',
      tab: 'DashboardPage',
      active: false,
      enabled: true,
      icon: iconTabs['products'],
    },
    {
      index: 1,
      type: 'logo-usd',
      title: 'Pagar',
      tab: 'PaymentsMainPage',
      active: false,
      enabled: true,
      icon: iconTabs['payment']
    },
    {
      index: 2,
      type: 'repeat',
      title: 'Transferir',
      tab: 'NewTransferMenuPage',
      enabled: true,
      active: false,
      icon: iconTabs['transfer']
    },
    {
      index: 3,
      type: 'documents',
      title: 'Documentos',
      tab: 'DocsMenuPage',
      enabled: true,
      active: false,
      icon: iconTabs['document']
    }
  ];

  constructor(
    private events: Events
  ) {
  }

  get(): Array<ModelTab> {
    return this.itemsTab;
  }

  getTabIndex(page: string): number {
    let index = 0;
    this.itemsTab.forEach((e: ModelTab) => {
      if (e.tab === page) {
        index = e.index;
      }
    });
    return index;
  }

}

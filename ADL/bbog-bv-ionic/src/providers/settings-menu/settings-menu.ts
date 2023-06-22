import * as settingsMenu from './settings-menu.json';
import { Injectable } from '@angular/core';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map.js';

@Injectable()
export class SettingsMenuProvider {

  constructor() { }

  getSettingsMenu(hasAccounts: boolean) {
    const array = settingsMenu;
    const menu: Array<BdbMap> = new Array();
    Object.assign(menu, array);
    if (!hasAccounts) {
      menu.forEach(e => {
        if (e.key === 'natAcctlimits' || e.key === 'limits') {
          e.enabled = false;
        }
      });
    }
    return menu;
  }

}

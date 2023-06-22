import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';

@IonicPage()
@Component({
  selector: 'page-context-menu',
  templateUrl: 'context-menu.html',
})
export class ContextMenuPage {

  contextMenuList: Array<BdbMap> = [];
  showContextArrow = true;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams
  ) {
    const data = navParams.get('data');
    this.showContextArrow = navParams.get('showContextArrow');
    this.contextMenuList = data;
  }

  ionViewDidLoad() {
  }

  onContextCancel() {
    this.viewCtrl.dismiss();
  }

  onContextSelection(event) {
    this.viewCtrl.dismiss({
      event
    });
  }

}

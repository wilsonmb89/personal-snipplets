import { Component, ViewChild, OnInit, DoCheck, OnChanges } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ViewController, App, Platform, Content } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-transactions',
  templateUrl: 'modal-transactions.html',
})
export class ModalTransactionsPage implements OnInit {

  @ViewChild('content') nav: NavController;
  modalPage: string;
  title: string;
  @ViewChild(Content) content: Content;
  hideLeftOption = false;
  hideRightOption = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public events: Events,
    public appCtrl: App,
    private platform: Platform
  ) {
    this.title = navParams.get('title');
    this.title = navParams.get('value');
    // subscribe to closure event
    events.subscribe('modal:close', () => {
      this.viewCtrl.dismiss();
    });
    // register back button to enable navigation in android
    platform.registerBackButtonAction(() => {
      this.onBackPressed();
    }, 1);
    // subscribe to resize mobile summary header event
    events.subscribe('resize:summary', () => {
      this.content.resize();
    });
    // subscribe to update header title
    events.subscribe('header:title', (e: string) => {
      this.title = e;
    });
    // subscribe to remove button header
    events.subscribe('header:btn:remove', (e: string) => {

      if (e === 'left') {
        this.hideLeftOption = true;
      } else if (e === 'right') {
        this.hideRightOption = true;
      } else {
        this.hideLeftOption = true;
        this.hideRightOption = true;
      }
    });
    // subscribe to add button header
    events.subscribe('header:btn:add', (e: string) => {

      if (e === 'left') {
        this.hideLeftOption = false;
      } else if (e === 'right') {
        this.hideRightOption = false;
      } else {
        this.hideLeftOption = false;
        this.hideRightOption = false;
      }
    });
  }

  ngOnInit() {
    if (this.navParams.get('template') !== undefined) {
      this.nav.push(this.navParams.get('template'), this.navParams.data);
    }
  }

  onBackPressed() {
    if (this.appCtrl.getActiveNav().getActive().isFirst()) {
      this.viewCtrl.dismiss();
    } else {
      this.appCtrl.getActiveNav().pop();
    }
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }
}

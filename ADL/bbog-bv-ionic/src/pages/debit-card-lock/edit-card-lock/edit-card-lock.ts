import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, IonicApp, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DebitCardLockProvider } from '../../../providers/debit-card-lock/debit-card-lock';
import { NavigationProvider } from '../../../providers/navigation/navigation';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';

@IonicPage()
@Component({
  selector: 'page-edit-card-lock',
  templateUrl: 'edit-card-lock.html',
})
export class EditCardLockPage {

  item: any;
  index: number;
  callback: any;
  reasonBlockingList: Array<any> = [];
  editSecurityForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private debitCardLock: DebitCardLockProvider,
    private navigationProvider: NavigationProvider,
    readonly _ionicApp: IonicApp,
    public events: Events,
    readonly bdbPlatforms: BdbPlatformsProvider

  ) {

    this.item = navParams.get('item');
    this.index = navParams.get('index');
    this.callback = this.navParams.get('callback');

    this.reasonBlockingList = debitCardLock.getReasonBlocking();

    this.editSecurityForm = formBuilder.group({
      reasonBlocking: ['', [Validators.required]]
    });

    this.editSecurityForm.controls.reasonBlocking.valueChanges.subscribe(
      debitCardLock.changeGroup(
        this.index,
        this.editSecurityForm,
        this.callback,
        this.callBackBackPage
      )
    );
  }

  ionViewDidLoad() {
  }

  callBackBackPage = () => {
    return new Promise((resolve, reject) => {
      if (this.bdbPlatforms.isMobile()) {
        this.navCtrl.setRoot('DashboardPage');
        this.events.publish('modal:close');
      } else {
        this.navCtrl.setRoot('DashboardPage');
      }
      resolve();
    });
  }

}

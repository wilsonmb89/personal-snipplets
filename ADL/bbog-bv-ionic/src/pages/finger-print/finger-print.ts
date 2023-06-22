import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbInMemoryKeys } from '../../providers/storage/bdb-in-memory/bdb-in-memory-keys';
import { SecurePassRq } from '../../app/models/auth/secure-pass-rq';
import { BdbInMemoryIonicProvider } from '../../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { PageTrack } from '../../app/core/decorators/AnalyticTrack';

/**
 * Generated class for the FingerPrintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@PageTrack({title: 'page-finger-print'})
@IonicPage()
@Component({
  selector: 'page-finger-print',
  templateUrl: 'finger-print.html',
})
export class FingerPrintPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private bdbInMemoryIonic: BdbInMemoryIonicProvider
  ) {
  }

  ionViewDidLoad() {

  }

  saveUser() {

  }

}

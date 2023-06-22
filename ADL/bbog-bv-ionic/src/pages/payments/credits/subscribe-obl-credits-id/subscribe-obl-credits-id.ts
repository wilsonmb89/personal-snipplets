import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { EnrollProduct } from '../../../../app/models/transfers/subscribe-acct';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import {ManageOblRq} from '@app/apis/transfer/transfer-core/models/manage-obl.model';

@PageTrack({ title: 'subscribe-obl-credits' })
@IonicPage({
  name: 'subscribe%obl%credits',
  segment: 'subscribe%obl%credits'
})
@Component({
  selector: 'page-subscribe-obl-credits-id',
  templateUrl: 'subscribe-obl-credits-id.html',
})
export class SubscribeOblCreditsIdPage {

  title: string;
  detailForm: FormGroup;
  itemsBare: any[];
  productInputDisabled: true;
  subscribeOblRq: ManageOblRq;
  creditListBank: any[];
  abandonText = BdbConstants.ABANDON_ENROLL;
  navTitle = 'Inscripción de créditos';

  private _enrollCredits = this.funnelKeysProvider.getKeys().enrollCredits;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private bdbModal: BdbModalProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private navigation: NavigationProvider,
    private events: Events
  ) {
    this.title = 'Datos del crédito';
    this.detailForm = this.formBuilder.group({
      bankName: ['', [Validators.required]],
      creditNumber: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewWillEnter() {
    this.events.publish('srink', true);
  }

  navigateToUserData() {
    this.funnelEventsProvider.callFunnel(this._enrollCredits, this._enrollCredits.steps.bankHolder);
    if (this.subscribeOblRq) {
      this.subscribeOblRq.targetAccountId = this.detailForm.get('creditNumber').value.toString();
      this.subscribeOblRq.targetAccountType = BdbConstants.CREDIT;
      this.bdbInMemory.setItemByKey(InMemoryKeys.ProductToEnroll, this.subscribeOblRq);
      this.navCtrl.push('subscribe%obl%person');
    }
  }

  mapEvent(enrollProduct: EnrollProduct) {
    this.subscribeOblRq = new ManageOblRq();
    this.subscribeOblRq.targetAccountBankId = enrollProduct.bankInfo.bankId;
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }
}

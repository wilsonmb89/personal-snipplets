import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { IdentificationTypeListProvider } from '../../../../providers/identification-type-list-service/identification-type-list-service';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeyModel } from '../../../../providers/funnel-keys/funnel-key-model';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { PersonDataComponent } from '../../../../components/person-data/person-data';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import {SubscribeTransferAcctRq} from '../../../../new-app/core/services-apis/transfer/transfer-core/models/subscribe-transfer-acct.model';
import {getValueDocumentTypeOpt} from '@app/shared/utils/bdb-constants/constants';

@PageTrack({ title: 'subscribe-acct-person' })
@IonicPage({
  name: 'subscribe%acct%person',
  segment: 'subscribe%acct%person'
})
@Component({
  selector: 'page-subscribe-acct-person',
  templateUrl: 'subscribe-acct-person.html',
})
export class SubscribeAcctPersonPage {

  @ViewChild('pb') pb: PersonDataComponent;

  title: string;
  subtitleName: string;
  subtitleType: string;
  subtitleNumber: string;
  listItem: any[];
  validForm = false;
  navTitle = 'Inscripción de cuentas';
  private _funnel: FunnelKeyModel = this.funnelKeys.getKeys().enrollAccounts;
  abandonText = BdbConstants.ABANDON_ENROLL;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    public identificationTypeListService: IdentificationTypeListProvider,
    private navigation: NavigationProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider
  ) {
    this.title = 'Datos del titular';
    this.subtitleName = 'Nombres completos';
    this.subtitleType = 'Tipo de documento';
    this.subtitleNumber = 'Número de documento';
  }

  ionViewDidLoad() {
    this.listItem = this.identificationTypeListService.getList();
  }

  triggerAcct(acctPersonForm: FormGroup) {
   const subscribeAcct: SubscribeTransferAcctRq = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductToEnroll);
    subscribeAcct.targetName = acctPersonForm.controls.personName.value;
    subscribeAcct.targetIdNumber = acctPersonForm.controls.personDocNumber.value;
    subscribeAcct.targetIdType = getValueDocumentTypeOpt(acctPersonForm.controls.personDocType.value);
    this.bdbInMemory.setItemByKey(InMemoryKeys.ProductToEnroll, subscribeAcct);
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.acctHolder);
    this.navCtrl.push('subscribe%acct%name');
  }

  isValid( e: string) {
    this.validForm = (e === 'VALID');
  }

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  triggerAcctMobile() {
    this.pb.triggerAcct();
  }
}

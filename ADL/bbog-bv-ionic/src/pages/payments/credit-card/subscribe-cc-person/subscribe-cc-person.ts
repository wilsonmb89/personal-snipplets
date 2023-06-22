import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { FunnelKeyModel } from '../../../../providers/funnel-keys/funnel-key-model';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { IdentificationTypeListProvider } from '../../../../providers/identification-type-list-service/identification-type-list-service';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { PersonDataComponent } from '../../../../components/person-data/person-data';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import {getValueDocumentTypeOpt} from '@app/shared/utils/bdb-constants/constants';
import {ManageOblRq} from '@app/apis/transfer/transfer-core/models/manage-obl.model';

@PageTrack({ title: 'subscribe-cc-person' })
@IonicPage({
  name: 'subscribe%cc%person',
  segment: 'subscribe%cc%person'
})
@Component({
  selector: 'page-subscribe-cc-person',
  templateUrl: 'subscribe-cc-person.html',
})
export class SubscribeCcPersonPage {

  @ViewChild('pb') pb: PersonDataComponent;

  title: string;
  subtitleName: string;
  subtitleType: string;
  subtitleNumber: string;
  listItem: any[];
  validForm = false;
  navTitle = 'Inscripción de tarjetas';
  abandonText = BdbConstants.ABANDON_ENROLL;
  private _funnel: FunnelKeyModel = this.funnelKeys.getKeys().enrollAccounts;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbInMemory: BdbInMemoryProvider,
    public identificationTypeListService: IdentificationTypeListProvider,
    private navigation: NavigationProvider,
    private funnelKeys: FunnelKeysProvider,
    private funnelEvents: FunnelEventsProvider) {
      this.title = 'Datos del titular';
      this.subtitleName = 'Nombres completos';
      this.subtitleType = 'Tipo de documento';
      this.subtitleNumber = 'Número de documento';
  }

  ionViewDidLoad() {
    this.listItem = this.identificationTypeListService.getList();
  }

  triggerCc(acctPersonForm: FormGroup) {
    const subscribeObl: ManageOblRq = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductToEnroll);
    subscribeObl.affiliationName = acctPersonForm.controls.personName.value;
    subscribeObl.targetIdNumber = acctPersonForm.controls.personDocNumber.value;
    subscribeObl.targetIdType = getValueDocumentTypeOpt(acctPersonForm.controls.personDocType.value);
    this.bdbInMemory.setItemByKey(InMemoryKeys.ProductToEnroll, subscribeObl);
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.acctHolder);
    this.navCtrl.push('subscribe%credit-card%alias');
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

  triggerCcMobile() {
    this.pb.triggerAcct();
  }

}

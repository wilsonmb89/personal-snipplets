import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { FunnelKeyModel } from '../../../../providers/funnel-keys/funnel-key-model';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { IdentificationTypeListProvider } from '../../../../providers/identification-type-list-service/identification-type-list-service';
import { PersonDataComponent } from '../../../../components/person-data/person-data';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { getValueDocumentTypeOpt } from '../../../../new-app/shared/utils/bdb-constants/constants';
import {ManageOblRq} from '@app/apis/transfer/transfer-core/models/manage-obl.model';

@PageTrack({ title: 'subscribe-obl-person' })
@IonicPage({
  name: 'subscribe%obl%person',
  segment: 'subscribe%obl%person'
})
@Component({
  selector: 'page-subscribe-obl-person',
  templateUrl: 'subscribe-obl-person.html',
})
export class SubscribeOblPersonPage {

  @ViewChild('pb') pb: PersonDataComponent;

  title: string;
  subtitleName: string;
  subtitleType: string;
  subtitleNumber: string;
  listItem: any[];
  validForm = false;
  navTitle = 'Inscripción de créditos';
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

  onBackPressed() {
    this.navigation.onBackPressed(this.navCtrl);
  }

  triggerCc(acctPersonForm: FormGroup) {
    const subscribeRq: ManageOblRq = this.bdbInMemory.getItemByKey(InMemoryKeys.ProductToEnroll);
    subscribeRq.affiliationName = acctPersonForm.controls.personName.value;
    subscribeRq.targetIdNumber = acctPersonForm.controls.personDocNumber.value;
    subscribeRq.targetIdType = getValueDocumentTypeOpt(acctPersonForm.controls.personDocType.value);
    this.bdbInMemory.setItemByKey(InMemoryKeys.ProductToEnroll, subscribeRq);
    this.funnelEvents.callFunnel(this._funnel, this._funnel.steps.acctHolder);
    this.navCtrl.push('subscribe%credit%alias');
  }

  onAbandonClicked() {
    this.navCtrl.popToRoot();
  }

  triggerCcMobile() {
    this.pb.triggerAcct();
  }

  isValid( e: string) {
    this.validForm = (e === 'VALID');
  }

}

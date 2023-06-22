import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { MobileSummaryProvider } from '../../../../components/mobile-summary';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { BdbConstants } from '../../../../app/models/bdb-generics/bdb-constants';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { PageTrack } from '../../../../app/core/decorators/AnalyticTrack';
import { Events } from 'ionic-angular';
import { ListCataloguesDelegateProvider } from '@app/delegate/list-parameters/list-catalogues-delegate.service';
import { Catalogue } from '../../../../new-app/core/services-apis/user-features/models/catalogue.model';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { CatalogsEnum } from '@app/delegate/list-parameters/enums/catalogs-enum';

@PageTrack({ title: 'page-donations' })
@IonicPage()
@Component({
  selector: 'page-donations',
  templateUrl: 'donations.html'
})
export class DonationsPage {

  formDonation: FormGroup;
  private _funnel;
  listRecipient = [];
  abandonText = BdbConstants.ABANDON_TRANS;
  subtitle = '¿A quién vas a donar?';
  navTitle = 'Donaciones';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private navigation: NavigationProvider,
    private mobileSummary: MobileSummaryProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private funnelKeysProvider: FunnelKeysProvider,
    private funnelEventsProvider: FunnelEventsProvider,
    private progressBar: ProgressBarProvider,
    private accessDetail: AccessDetailProvider,
    private events: Events,
    private listCataloguesDelegateProvider: ListCataloguesDelegateProvider,
    private bdbModal: BdbModalProvider
  ) {
    this._funnel = this.funnelKeysProvider.getKeys().donations;
    this.buildFormDonation();
    this.events.publish('srink', true);
  }

  ionViewWillEnter() {
    this.mobileSummary.reset();
    this.progressBar.resetObject();
    this.progressBar.setTitle(BdbConstants.PROGBAR_STEP_1, 'Entidad');
    this.progressBar.setContraction('E');
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_1, true);
    if (this.accessDetail.isOriginSelected()) {
      this.accessDetail.updateProgressBarDone(this.accessDetail.getOriginSelected());
    }
  }

  ionViewDidLoad() {
    this.buildRecipient();
  }

  private buildFormDonation() {
    this.formDonation = this.formBuilder.group(
      {
        type: ['d', Validators.compose([Validators.required])],
      }
    );
  }

  public submit() {
    this.gotoAmount(this.formDonation.value.type);
  }


  buildRecipient() {
    this.listCataloguesDelegateProvider.getListCatalogs(CatalogsEnum.CONVENIOS_DONACIONES, null)
      .subscribe(
        (catalogues: Array<Catalogue>) => {
          this.listRecipient = catalogues;
          this.checkSelectedEntity();
        },
        () => {
          this.bdbModal.launchErrModal(
            'Ha ocurrido un error',
            'No se ha podido consultar el listado de convenios. Por favor intenta de nuevo.',
            'Volver a intentar'
          );
        }
      );
  }

  private checkSelectedEntity(): void {
    const selectedEntityCode = this.navParams.get('selectedEntityCode');
    if (!!selectedEntityCode) {
      const itemSel = this.listRecipient.find((item: Catalogue) => item.id === selectedEntityCode);
      if (!!itemSel) {
        this.formDonation.get('type').setValue(itemSel);
      }
    }
  }

  gotoAmount(data) {
    this.funnelEventsProvider.callFunnel(this._funnel, this._funnel.steps.option);
    const donationInfo = {
      recipent: data,
      contraction: this.getContraction(data.name)
    };

    this.bdbInMemory.setItemByKey(InMemoryKeys.DonationInfo, donationInfo);
    this.navCtrl.push('DonationAmountPage', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  getContraction(name): string {
    return name.split(' ').map(d => d.substring(0, 1).toUpperCase()).join('').substring(0, 2);
  }

  public onAbandonClicked(): void {
    this.navCtrl.setRoot('NewTransferMenuPage', { 'tab': 'donations' });
  }

  public onBackPressed(): void {
    this.navigation.onBackPressedCustPage(this.navCtrl, 'NewTransferMenuPage', 'donations');
  }

}

import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { CompanyAval, CompanyAvalData } from '../../../app/models/company-aval';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { PageTrack } from '../../../app/core/decorators/AnalyticTrack';
import { BdbModalProvider } from '../../../providers/bdb-modal/bdb-modal';
import { SessionProvider } from '../../../providers/authenticator/session';
import { BdbMaskProvider } from '../../../providers/bdb-mask';
import { HttpErrorResponse } from '@angular/common/http';
import { AvalProductsDelegateService } from '@app/delegate/products-delegate/aval-products-delegate.service';

@PageTrack({title: 'age-selection-aval'})
@IonicPage()
@Component({
  selector: 'page-selection-aval',
  templateUrl: 'selection-aval.html',
})
export class SelectionAvalPage {

  companies: CompanyAval[];
  isMobile: boolean;
  icon: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bdbPlatforms: BdbPlatformsProvider,
    private modalCtrl: BdbModalProvider,
    private loading: LoadingController,
    private bdbMask: BdbMaskProvider,
    private avaProductsDelegateService: AvalProductsDelegateService
  ) {
    this.icon = 'asdas.svg';
    this.companies = CompanyAvalData.companies;
    this.isMobile = this.bdbPlatforms.isMobile() || this.bdbPlatforms.isTablet();
  }

  clickCard(company: CompanyAval) {
    const loader = this.loading.create();
    loader.present().then(() => {

      this.avaProductsDelegateService.getAvalProducts(company.code).subscribe(
        (products) => {

          this.navCtrl.push('SummaryAvalPage', {company, products});
          loader.dismiss();
        }, (error: HttpErrorResponse) => {
          loader.dismiss();
          if (error.status === 409) {
            this.modalCtrl.launchErrModal(
              'No tienes productos',
              `No cuentas con productos en ${company.name} actualmente.`,
              'Aceptar');
          } else {
            this.modalCtrl.launchErrModal(
              'Ha ocurrido un error',
              'Por favor intenta de nuevo más tarde.',
              'Aceptar');
          }
        });
    });
  }

  backDesktop() {
    this.navCtrl.pop();
  }

  backMobile() {
    this.navCtrl.setRoot('TabsPage', {
      tabIndex: 0
    });
  }

  logout() {
    this.navCtrl.push('authentication/logout');
  }

}




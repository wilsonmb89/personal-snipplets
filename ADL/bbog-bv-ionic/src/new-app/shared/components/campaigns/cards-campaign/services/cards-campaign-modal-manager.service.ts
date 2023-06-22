import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PulseModalControllerProvider } from '../../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { UnicefTycCardModal } from '@app/shared/components/campaigns/cards-campaign/components/terminos-card-modal/unicef/unicef-tyc-card-modal';
import { GreenCardTycModal } from '@app/shared/components/campaigns/cards-campaign/components/terminos-card-modal/greenCard/green-card-tyc-modal';
import { UpdateUserDataModalComponent } from '@app/shared/components/campaigns/cards-campaign/components/update-user-data-modal/update-user-data-modal';
import { ErrorCardRequestModalComponent } from '@app/shared/components/campaigns/cards-campaign/components/error-card-request-modal/error-card-request-modal';
import { ErrorCardInProgressModal } from '@app/shared/components/campaigns/cards-campaign/components/error-card-in-progress-modal/error-card-in-progress-modal';
import { ErrorClientHasACardModal } from '@app/shared/components/campaigns/cards-campaign/components/error-client-has-a-card-modal/error-client-has-a-card-modal';

@Injectable()
export class CardsCampaignModalManagerProvider {

  private viewRef: ViewContainerRef;
  private resolver: ComponentFactoryResolver;
  private navCtrl: NavController;

  constructor(
    private pulseModalCtrl: PulseModalControllerProvider
  ) { }

  public initManager(viewRef: ViewContainerRef, resolver: ComponentFactoryResolver, navCtrl: NavController): void {
    this.viewRef = viewRef;
    this.resolver = resolver;
    this.navCtrl = navCtrl;
  }


  public async showErrorCardRequestModal(): Promise<void> {
    await this.showModal(ErrorCardRequestModalComponent);
  }
  public async showErrorCardInProgressModal(): Promise<void> {
    await this.showModal(ErrorCardInProgressModal);
  }
  public async showErrorClientHasACard(): Promise<void> {
    await this.showModal(ErrorClientHasACardModal);
  }

  public async showTYCCardModal(cardType: 'unicef' | 'greenCard'): Promise<void> {
    switch (cardType) {
      case 'greenCard':
        await this.showModal(GreenCardTycModal, 'xl');
        break;
      case 'unicef':
        await this.showModal(UnicefTycCardModal, 'xl');
        break;
    }

  }

  public async showUpdateUserDataModal(): Promise<void> {
    this.showModal(UpdateUserDataModalComponent)
      .then(res => {
        if (!!res && !!res.state) {
          this.navigate(res.state);
        }
      })
      .catch();
  }




  private navigate(state: string): void {
    switch (state) {
      case 'goback':
        if (this.navCtrl.canGoBack()) {
          this.navCtrl.pop();
        } else {
          this.navCtrl.setRoot('DashboardPage');
        }
        break;
      case 'updateuserdata':
        this.navCtrl.push('CustomerBasicInfoPage');
        break;
      default:
        break;
    }
  }


  private async showModal<T>(modalComponent: T, size: string = 'default'): Promise<any> {
    try {
      const modal = await this.pulseModalCtrl.create({
        component: modalComponent,
        size
      }, this.viewRef, this.resolver);
      await modal.present();
      const { data } = await modal.onWillDismiss();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

}

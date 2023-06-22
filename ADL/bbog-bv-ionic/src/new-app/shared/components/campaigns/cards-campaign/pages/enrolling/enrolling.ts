import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { InMemoryKeys } from '../../../../../../../providers/storage/in-memory.keys';
import { CardsCampaignModalManagerProvider } from '@app/shared/components/campaigns/cards-campaign/services/cards-campaign-modal-manager.service';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { filter, take } from 'rxjs/operators';
import { UserFeatures } from '@app/apis/user-features/models/UserFeatures';
import { EnrollCustomCardDelegateService } from '@app/delegate/enroll-custom-card-delegate/enroll-custom-card-delegate.service';


interface CardTypeInfo {
  imageHeader?: string;
  imageBody?: string;
  launchToSuccess?: () => void;
}


@IonicPage()
@Component({
  selector: 'page-enrolling',
  templateUrl: 'enrolling.html',
})
export class EnrollingPage implements OnInit {

  private enrollmentResult: string;

  public imageHeader: string;
  public imageBody: string;

  public typeInfo: CardTypeInfo = {};


  private readonly ERROR_CODE_UNICEF_CLIENT_HAS_A_CARD = '4078';
  private readonly ERROR_CODE_GREEN_CARD_CLIENT_HAS_A_CARD = '1782';
  private readonly ERROR_CODE_SOME_CARD_IS_PENDING = '00715';

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    private bdbStorageService: BdbStorageService,
    private enrollCustomCardDelegateService: EnrollCustomCardDelegateService,
    private modalManagerProvider: CardsCampaignModalManagerProvider,
    private viewRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private userFacade: UserFacade,
  ) {

    const cardType: 'unicef' | 'greenCard' = this.navParams.get('data');
    switch (cardType) {
      case 'unicef':
        this.typeInfo = {
          imageBody: 'assets/imgs/products/unicef-enrolling/icon-enrolling-unicef.png',
          imageHeader: 'assets/imgs/products/unicef-landing/header-logos.svg',
          launchToSuccess: () => {
            this.navCtrl.push('EnrolledPage', {data: cardType});
          }
        };
        this.callEnrollment(cardType);
        break;
      case 'greenCard':
        this.typeInfo = {
          imageBody: 'assets/imgs/shared/cards-campaign-carousel/card-green.png',
          imageHeader: 'assets/imgs/shared/cards-campaign-carousel/green-card/green-card-landing/green-card-header-logos.svg',
          launchToSuccess: () => {
            this.navCtrl.push('EnrolledPage', {data: cardType});
          }
        };
        this.callEnrollment(cardType);
        break;
      default:
        this.navCtrl.push('DetailAndTxhistoryPage');

    }

  }

  ngOnInit(): void {
    this.modalManagerProvider.initManager(this.viewRef, this.resolver, this.navCtrl);
  }

  public ionViewWillLeave(): void {
    this.navCtrl.getPrevious().data.enrollmentResult = this.enrollmentResult;
  }

  private callEnrollment(cardType): void {
    this.enrollmentResult = '';
    const initTime = new Date().getTime();
    const enrollCustomRequest = this.bdbStorageService.getItemByKey(InMemoryKeys.EnrollCustomCardData);
    this.enrollCustomCardDelegateService.enrollCustomCard(enrollCustomRequest)
      .subscribe(
        res => this.finish(initTime, () => {
          this.setUserFeaturesTrue(cardType);
        }),
        err => this.finish(initTime, () => {

          const errorMessage: string = err.error.errorMessage;

          if (errorMessage.includes(this.ERROR_CODE_GREEN_CARD_CLIENT_HAS_A_CARD) ||
            errorMessage.includes(this.ERROR_CODE_UNICEF_CLIENT_HAS_A_CARD))  {
            this.setUserFeaturesTrue(cardType);
            this.modalManagerProvider.showErrorClientHasACard();

          } else if (errorMessage.includes(this.ERROR_CODE_SOME_CARD_IS_PENDING)) {
            this.modalManagerProvider.showErrorCardInProgressModal();

          } else {
            this.modalManagerProvider.showErrorCardRequestModal();
          }

        }));
  }

  private finish(initTime: number, callback: () => void): void {
    const endTime = new Date().getTime();
    const duration = endTime - initTime;
    const diffTime = (duration < 3000) ? 3000 - duration : 0;
    setTimeout(callback, diffTime);
  }


  private setUserFeaturesTrue(cardType) {
    this.userFacade.userFeatures$
      .pipe(take(1))
      .subscribe(userFeatures => {
        if (cardType === 'unicef') {
          userFeatures.settings.unicefCardRequested = true;
        } else {
          userFeatures.settings.greenCardRequested = true;
        }
        this.updateUserFeatures(userFeatures, cardType);
      });
  }

  private updateUserFeatures(userFeatures: UserFeatures, cardType) {
    this.userFacade.updateUserFeaturesData(userFeatures);
    this.userFacade.userFeaturesState$.pipe(
      filter(state => !state.working && (!!state.userFeatures || !!state.error)),
      take(1)
    ).subscribe(
      state => {
        if (state.completed && !!state.userFeatures) {
          this.navCtrl.push('EnrolledPage', {data: cardType});
        } else {
          this.modalManagerProvider.showErrorCardRequestModal();
        }
      }
    );
  }

}

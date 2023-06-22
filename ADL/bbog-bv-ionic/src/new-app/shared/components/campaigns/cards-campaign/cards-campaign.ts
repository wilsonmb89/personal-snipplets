import { Component, Input, OnInit } from '@angular/core';
import { CustomerInfo } from '../../../../../providers/customer-management/customer-info';
import { InMemoryKeys } from '../../../../../providers/storage/in-memory.keys';
import { LoadingController, NavController } from 'ionic-angular';
import { GetAllBasicDataDelegateService } from '@app/delegate/customer-basic-data-delegate/get-all-delegate.service';
import { BdbModalProvider } from '../../../../../providers/bdb-modal/bdb-modal';
import { BdbConstants } from '../../../../../app/models/bdb-generics/bdb-constants';
import { ProductDetail } from '../../../../../app/models/products/product-model';
import { take } from 'rxjs/operators';
import { ItemCardModel } from '@app/shared/components/campaigns/cards-campaign/model/card-campaign.model';
import { BdbStorageService } from '@app/shared/utils/bdb-storage-service/bdb-storage.service';
import { UserFacade } from '@app/shared/store/user/facades/user.facade';
import { Customer } from '@app/apis/user-features/models/UserFeatures';


@Component({
  selector: 'cards-campaign',
  templateUrl: 'cards-campaign.html'
})
export class CardsCampaign implements OnInit {

  public cards: ItemCardModel[] = [];

  @Input()
  private productSelected: ProductDetail;

  constructor(private loadingCtrl: LoadingController,
              private getAllDelegateService: GetAllBasicDataDelegateService,
              private storageService: BdbStorageService,
              private navCtrl: NavController,
              private bdbModal: BdbModalProvider,
              private userFacade: UserFacade
  ) {

  }

  private setCardsToShow(): void {

    this.userFacade.userFeatures$.pipe(take(1)).subscribe(userFeatures => {

      const userSettings = userFeatures.settings;
      const customer = userFeatures.customer;

      if (this.validateUserToShowCards(customer)) {
        if (!userSettings.unicefCardRequested) {
          this.cards.push({
            title: 'Tarjeta UNICEF',
            image: 'card-unicef.png',
            backgroundColor: 'unicef',
            description: 'Ayuda a los que más lo necesitan con cada uso de tu tarjeta.',
            callback: () => this.goToCardPage('unicef')
          });
        }

        if (!userSettings.greenCardRequested) {
          this.cards.push({
            title: 'Tarjeta AMAZONÍA',
            image: 'card-green.png',
            backgroundColor: 'green',
            description: 'Ayuda a la reforestación del Amazonas con cada uso de tu tarjeta.',
            callback: () => this.goToCardPage('greenCard')
          });
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.checkValidSavingAccount()) {
      this.setCardsToShow();
    }
  }

  private validateUserToShowCards(customer: Customer): boolean {
    return customer.identificationType !== 'NI' &&
      customer.identificationType !== 'NE' &&
      customer.identificationType !== 'NJ';
  }

  public getClassForItemsByCardsLength(cardsLength: number): string {
    return cardsLength === 1 ? 'cards-campaign--width-for--unique'
      : 'cards-campaign--width-for--two';
  }


  public checkValidSavingAccount(): boolean {
    const validAccounts = ['010AH', '060AH', '061AH', '062AH', '063AH', '098AH'];
    return this.productSelected.productType === BdbConstants.ATH_SAVINGS_ACCOUNT
      && validAccounts.indexOf(this.productSelected.productDetailApi.productBankSubType) !== -1;
  }

  private goToCardPage(page: 'unicef' | 'greenCard'): void {
    const load = this.loadingCtrl.create();
    load.present().then(() => {
      this.getAllDelegateService.getAllBasicDataDelegate()
        .pipe(take(1))
        .subscribe(
          (data: CustomerInfo) => {
            this.storageService.setItemByKey(InMemoryKeys.CustomerInfo, data);
            load.dismiss();
            switch (page) {
              case 'unicef':
                this.navCtrl.push('UnicefLandingPage');
                break;
              case 'greenCard':
                this.navCtrl.push('GreenCardLandingPage');
                break;
            }

          },
          (err) => {
            load.dismiss();
            this.bdbModal.launchErrModal(
              'Error',
              'Error al consultar la información. Intente de nuevo',
              'Aceptar'
            );
          }
        );
    });


  }


}

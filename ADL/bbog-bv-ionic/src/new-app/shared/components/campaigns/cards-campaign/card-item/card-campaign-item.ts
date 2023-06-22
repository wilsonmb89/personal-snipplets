import { Component, Input } from '@angular/core';
import { ItemCardModel } from '@app/shared/components/campaigns/cards-campaign/model/card-campaign.model';


@Component({
  selector: 'card-campaign-item',
  templateUrl: 'card-campaign-item.html'
})
export class CardCampaignItem {


  @Input()
  public itemCardModel: ItemCardModel;

  constructor() {
  }


  public getImgSrc(): string {
    return `assets/imgs/shared/cards-campaign-carousel/${this.itemCardModel.image}`;
  }

  public getBackgroundColor(): string {
    switch (this.itemCardModel.backgroundColor) {
      case 'unicef':
        return 'card-campaign-item--color-unicef';
      case 'green':
        return 'card-campaign-item--color-green';
    }

  }

  public executeCallback() {
    this.itemCardModel.callback();
  }

}

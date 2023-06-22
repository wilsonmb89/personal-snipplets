import { Component } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { GREEN_CARD_TYC_TXT } from '@app/shared/components/campaigns/cards-campaign/components/terminos-card-modal/greenCard/green-card-tyc';

@Component({
  selector: 'green-card-tyc-modal',
  templateUrl: './green-card-tyc-modal.html'
})
export class GreenCardTycModal {
  public tyc = GREEN_CARD_TYC_TXT;

  constructor() {
  }


}

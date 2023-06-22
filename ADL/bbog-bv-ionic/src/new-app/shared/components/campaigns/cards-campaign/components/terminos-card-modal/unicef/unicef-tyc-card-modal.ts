import { Component, OnInit } from '@angular/core';
import { UNICEF_TYC_TXT } from '@app/shared/components/campaigns/cards-campaign/components/terminos-card-modal/unicef/unicef-tyc';

@Component({
  selector: 'app-unicef-tyc-card-modal',
  templateUrl: './unicef-tyc-card-modal.html'
})
export class UnicefTycCardModal implements OnInit {
  public tyc = UNICEF_TYC_TXT;

  constructor() {
  }

  ngOnInit() {
  }
}

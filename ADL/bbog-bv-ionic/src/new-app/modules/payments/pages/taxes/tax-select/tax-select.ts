import { Component, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { UserFeaturesDelegateService } from '../../../../../core/services-delegate/user-features/user-features-delegate.service';
import { CardOptionModel } from '../../../components/card-option/model/card-option.model';

@IonicPage({
  name: 'tax%select%dian%district%page',
  segment: 'tax%select%dian%district%page'
})
@Component({
  selector: 'tax-select',
  templateUrl: './tax-select.html'
})
export class TaxSelectPage implements OnInit {

  taxOptions: CardOptionModel[];

  constructor(
    private userFeaturesService: UserFeaturesDelegateService
  ) {}

  ngOnInit(): void {
    this.validateUserFeatureService();
  }

  private validateUserFeatureService() {
    const allowedData: AllowedServices = { district: true, dian: true };
    this.userFeaturesService.isAllowedServiceFor('dianTaxPayment').subscribe(
      (isAllowed: boolean) => {
        allowedData.dian = !!isAllowed;
        this.buildOptions(allowedData);
      },
      err => {
        this.buildOptions(allowedData);
      }
    );
  }

  private buildOptions(allowedServices: AllowedServices) {
    const resultData = [];
    resultData.push(new CardOptionModel(
      'assets/imgs/payments/taxes/icon-tax-distritales.svg',
      'Distritales',
      'Paga acá impuestos de vivienda, vehículo, etc.',
      'Buscar',
      'page%tax%select',
      '',
      'taxPayment'
    ));
    if (allowedServices.dian) {
      resultData.push(new CardOptionModel(
        'assets/imgs/payments/taxes/icon-tax-dian.svg',
        'DIAN',
        'Paga tu declaración de renta o impuestos nacionales.',
        'Buscar',
        'search%tax%form',
        '¡Nuevo!',
        'taxPayment'
      ));
    }
    this.taxOptions = resultData;
  }

}

interface AllowedServices {
  district: boolean;
  dian: boolean;
}

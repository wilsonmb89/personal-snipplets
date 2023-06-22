import { Injectable } from '@angular/core';

import { RechargeItem } from '../models/recharges.model';

@Injectable()
export class RechargeRepoService {

  readonly rechargeItems: RechargeItem[] = [
    {
      type: 'phone',
      key: 'cl',
      value: 'Claro',
      code: '0215',
      src: 'assets/imgs/logo-claro-blanco.svg'
    },
    {
      type: 'phone',
      key: 'mv',
      value: 'Movistar',
      code: '0211',
      src: 'assets/imgs/logo-movistar-blanco.svg',
    },
    {
      type: 'phone',
      key: 'tg',
      value: 'Tigo',
      code: '0290',
      src: 'assets/imgs/logo-tigo-blanco.svg'
    },
    {
      type: 'facilpass',
      key: 'fp',
      value: 'FacilPass',
      code: '0290'
    }
  ];

  readonly phoneValues = [
    5000,
    10000,
    20000,
    30000,
    50000
  ];

  constructor() {}

  public getItems(): RechargeItem[] {
    return this.rechargeItems;
  }

  public getPhoneValues(): number[] {
    return this.phoneValues;
  }
}


import { Injectable } from '@angular/core';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { ENV } from '@app/env';

@Injectable()
export class CarriersRepoProvider {

  readonly carriers: BdbMap[] = [
    {
      key: 'cl',
      value: 'Claro',
      src: 'assets/imgs/logo-claro-blanco.svg',
      cod: '0215'
    },
    {
      key: 'mv',
      value: 'Movistar',
      src: 'assets/imgs/logo-movistar-blanco.svg',
      cod: '0211'
    },
    {
      key: 'tg',
      value: 'Tigo',
      src: 'assets/imgs/logo-tigo-blanco.svg',
      cod: '0290'
    }
  ];

  constructor() {}

  public getRepo() {
    return this.carriers;
  }

  public getDefaultValues(key: string): number[] {

    const options = [
      {
        key: 'cl',
        values: [
          5000,
          10000,
          20000,
          30000,
          50000
        ]
      },
      {
        key: 'mv',
        values: [
          5000,
          10000,
          20000,
          30000,
          50000
        ]
      },
      {
        key: 'tg',
        values: [
          5000,
          10000,
          20000,
          30000,
          50000
        ]
      },
    ];

    return (options.
      find(function (obj) {
        return obj.key === key;
      }) || { values: [] }).values;
  }
}

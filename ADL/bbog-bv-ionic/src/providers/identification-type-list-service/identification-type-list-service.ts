import { Injectable } from '@angular/core';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbMap } from '../../app/models/bdb-generics/bdb-map';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';

@Injectable()
export class IdentificationTypeListProvider {

  constructor(private bdbInMemory: BdbInMemoryProvider) {
  }

  getList() {

    return [
      { name: 'Cédula de ciudadanía', value: 'C' },
      { name: 'Tarjeta de Identidad', value: 'T' },
      { name: 'Cédula de Extranjería', value: 'E' },
      { name: 'NIT Persona Natural', value: 'L' },
      { name: 'NIT Persona Extranjera', value: 'I' },
      { name: 'NIT Persona Jurídica', value: 'N' },
      { name: 'Pasaporte', value: 'P' },
      { name: 'Registro Civil', value: 'R' }
    ];
  }

  public getListWithShort(): { name: string, value: string }[] {
    return [
      { name: 'C.C.     Cédula de ciudadanía', value: 'CC' },
      { name: 'T.I.     Tarjeta de Identidad', value: 'TI' },
      { name: 'C.E.     Cédula de Extranjería', value: 'CE' },
      { name: 'N.P.N.   NIT Persona Natural', value: 'NI' },
      { name: 'N.P.E.   NIT Persona Extranjera', value: 'NE' },
      { name: 'N.P.J.   NIT Persona Jurídica', value: 'NJ' },
      { name: 'P.S.     Pasaporte', value: 'PA' },
      { name: 'R.C.     Registro Civil', value: 'RC' }
    ];
  }

  public isLegalPerson(): boolean {
    const identificationType = this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationType);
    return !!['NJ', 'NI', 'NE'].find(idType => idType === identificationType);
  }

  getAthList(): Array<BdbMap> {
    return [
      {
        key: '',
        value: 'Seleccione...'
      },
      {
        key: '1',
        value: 'Cédula de Ciudadanía'
      },
      {
        key: '3',
        value: 'Tarjeta de Identidad'
      },
      {
        key: '2',
        value: 'Cédula de Extranjería'
      },
      {
        key: '6',
        value: 'NIT Persona Natural'
      },
      {
        key: '7',
        value: 'NIT Persona Extranjera'
      },
      {
        key: '8',
        value: 'NIT Persona Jurídica'
      },
      {
        key: '4',
        value: 'Pasaporte'
      },
      {
        key: '5',
        value: 'Registro Civil'
      }
    ];
  }


}





import {Injectable} from '@angular/core';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { Customer } from '../../app/models/bdb-generics/customer';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import * as productTypeConversion from './product-types-conversion.json';
import * as banksInfo from './banks-info.json';
import * as idTypeConversion from './id-type-conversion.json';
import { IdType } from './id-type.enum';
import { EncryptionIdType } from './encryption-id.enum';

@Injectable()
export class BdbUtilsProvider {
  constructor(
    private bdbInMemory: BdbInMemoryProvider,
    private bdbRsa: BdbRsaProvider
  ) { }

  getRandomColor(key: number): string {
    const colors = [
      {
        key: 0,
        value: '#f89b1b'
      },
      {
        key: 1,
        value: '#883979'
      },
      {
        key: 2,
        value: '#8cc53f'
      },
      {
        key: 3,
        value: '#ee7a21'
      },
      {
        key: 4,
        value: '#008c97'
      },
    ];

    let counter = 0;
    let index;
    for (let j = 0; j <= key; j++) {
      if (counter >= colors.length) {
        counter = 0;
      }
      index = counter;
      counter++;
    }
    return colors.find((e) => {
      return e.key === index;
    }).value;
  }


  /**
   * this method return the current authenticated user
   * @param idType enum, choose id fx type for making request.
   * default to BUS_BDB
   * @param encryptionType enum, choose encryption type {FULL, NONE, PARTIAL}
   * @returns {Customer} default will return identificationNumber encrypted
   */
  getCustomer(idType: IdType = IdType.BUS_BDB, encryptionType: EncryptionIdType = EncryptionIdType.PARTIAL): Customer {
    const identificationNumber = this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationNumber);
    let identificationType = this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationType);
    if (idType !== IdType.BUS_BDB) {
      identificationType = this.mapIdType(idType, this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationType));
    }
    if (encryptionType === EncryptionIdType.FULL) {
      return new Customer(this.bdbRsa.encrypt(identificationNumber),
        this.bdbRsa.encrypt(identificationType));
    } else if (encryptionType === EncryptionIdType.NONE) {
      return new Customer(identificationNumber, identificationType);
    } else {
      return new Customer(this.bdbRsa.encrypt(identificationNumber), identificationType);
    }
  }

  getClientIp(encrypted: boolean) {
    const clientIp = this.bdbInMemory.getItemByKey(InMemoryKeys.IP);
    return encrypted ? this.bdbRsa.encrypt(clientIp) : clientIp;
  }

  getImageUrl(franchise: string): string {
    const imgs = {
      'MC': BdbConstants.MASTERCARD_LOGO,
      'CB': BdbConstants.VISA_LOGO
    };
    return imgs[franchise];
  }

  normalize(str: string) {
    const from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc',
      mapping = {};

    for (let i = 0, j = from.length; i < j; i++) {
      mapping[from.charAt(i)] = to.charAt(i);
    }
    const ret = [];
    for (let i = 0, j = str.length; i < j; i++) {
      const c = str.charAt(i);
      if (mapping.hasOwnProperty(str.charAt(i))) {
        ret.push(mapping[c]);
      } else {
        ret.push(c);
      }
    }
    return ret.join('');
  }

  mapIdType(idEnumType, idType): string {
    const temp = idTypeConversion[idEnumType];
    return temp ? temp[idType] : idType;
  }

  mapTypeProduct(productType): string {
    const temp = productTypeConversion[productType];
    return (temp) ? temp.type : productType;
  }

  mapSubtypeProduct(productType): string {
    const temp = productTypeConversion[productType];
    return (temp) ? temp.subtype : productType;
  }

  mapPaymentProperty(productType): string[] {
    const temp = productTypeConversion[productType];
    return (temp) ? temp.propertyForPayments : '';
  }

  mapLoanTransferProperty(productType): string {
    const temp = productTypeConversion[productType];
    return (temp) ? temp.propertyForLoanTransfer : '';
  }

  getPaymentAvailable(productType): string[] {
    const temp = productTypeConversion[productType];
    return (temp) ? temp.paymentAvailables : '';
  }

  getMapTypeProductPay(productType): any {
    const tempMap = productTypeConversion[productType];
    return (!!tempMap && !!tempMap.payMap) ? tempMap.payMap : productType;
  }

  getMainProperty(productType): string {
    const tempMap = productTypeConversion[productType];
    return (tempMap) ? tempMap.mainProp : '';
  }

  getDateInString(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  pad(num: string, size: number): string {
    while (num.length < size) { num = '0' + num; }
    return num;
  }

  getBankIdAth(idBdb): String {
    const bank = banksInfo[idBdb];
    return (bank) ? bank.idAth : '';
  }

  dismiss(data, loading) {
    loading.dismiss();
  }

  error(err, loading) {
    loading.dismiss();
  }

  validateBusinessDay(): boolean {

    const currentDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));

    if (currentDate.getHours() >= 6 && currentDate.getHours() < 22) {
      return true;
    }

    return false;
  }

  public normalizeCurrenyVal(currencyVal: string): string {
    let result = currencyVal.replace(/[^0-9\,]+/g, '');
    result = result.indexOf(',') !== -1 ? result.substring(0, result.indexOf(',')) : result;
    return result;
  }

  public replaceAccents(word: String): string {
    const chars = {
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
      'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u', 'ñ': 'n',
      'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
      'À': 'A', 'È': 'E', 'Ì': 'I', 'Ò': 'O', 'Ù': 'U', 'Ñ': 'N'
    };
    const expr = /[áàéèíìóòúùñ]/ig;
    const res = word.replace(expr, function (e) { return chars[e]; });
    return res;
  }

  public calculateLastMonth(): string[] {
    const today = new Date();
    const startDate = new Date();
    startDate.setMonth(today.getMonth() - 1);
    const endDt = today.toJSON().slice(0, 10);
    const startDt = startDate.toJSON().slice(0, 10);
    const dateResult = [startDt, endDt];
    return dateResult;
  }

  public toCamelCase(text: string): string {
    return text.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

}

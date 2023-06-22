import { Injectable } from '@angular/core';
import { DatePipe, CurrencyPipe, registerLocaleData } from '@angular/common';
import { MaskType } from './bdb-mask-type.enum';
import localeEs from '@angular/common/locales/es-CO';
import { CustomCurrencyPipe } from '../../pipes/custom-currency';

@Injectable()
export class BdbMaskProvider {

  private readonly phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  private readonly months =
    [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ];

  constructor(
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private customCurrencyPipe: CustomCurrencyPipe
  ) {
    registerLocaleData(localeEs, 'co');
  }

  maskToPhone(): (string | RegExp)[] {
    return this.phoneMask;
  }

  setCharAt(text: string, index: number, chr: string): string {
    if (index > text.length - 1) {
      return text;
    }
    return text.substr(0, index) + chr + text.substr(index + 1);
  }

  maskToDecimal(num: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0
    });
    return formatter.format(num);
  }

  convertToPhone(phone: string): string {
    if (phone.length === 10) {
      const ind = phone.substr(0, 3);
      const num = phone.substr(2, 3);
      const dig = phone.substr(5, 4);
      return `(${ind}) ${num} ${dig}`;
    } else {
      return phone;
    }
  }

  unmaskToPlainNumber(number: string): number {

    if (number.lastIndexOf(',') >= 2) {
      return +number.replace(/[,|$]/g, '');
    }

    return +number.replace(/[.|$]/g, '').replace(',', '.');
  }
  unmaskToPlainPhone(number: string): number {
    return +(number.replace(/\D+/g, ''));
  }

  public maskFormatFactory(value, format: MaskType = MaskType.SELF, locale: string = 'es-CO'): string {
    switch (format) {
      case MaskType.DATE:
        return this.datePipe.transform(value, 'dd MMM yyyy', 'UTC');
      case MaskType.CURRENCY:
        return this.customCurrencyPipe.transform(value, '$ ', 2, '.', ',', 3);
      case MaskType.CURRENCY_NOCENTS:
        return this.currencyPipe.transform(value, 'USD', 'symbol', '1.0', locale);
      case MaskType.CUSTOM_CURRENCY:
        return this.customCurrencyPipe.transform(value, '$', 2, ',', '.', 3);
      case MaskType.PERCENTAGE:
        return `${value.substr(0, 4)}% E.A.`;
      case MaskType.SIMPLE_PERCENTAGE:
        return `${value.substr(0, 5)}%`;
      case MaskType.DATE_EVENT:
        return this.datePipe.transform(value, 'yyyy-MM-ddTHH:mm:ss.SSSZ');
      case MaskType.DATE_CUT:
        return this.datePipe.transform(value, 'ddMMyyyyHHmmss');
      case MaskType.TIME_SHORT:
        return this.datePipe.transform(value, 'dd MMM yyyy h:mm a');
      case MaskType.DATE_BILL:
        const raw = this.datePipe.transform(value, 'd MMM', 'UTC', 'es-CO');
        if (raw) {
          const temp: string[] = raw.split(' ');
          const day = temp[0].length > 1 ? temp[0] : `0${temp[0]}`;
          const woDot = temp[1].replace('.', '');
          const month = woDot.charAt(0).toUpperCase() + woDot.slice(1);
          const reDate = `${day} ${month}`;
          return reDate;
        }
        return '---';
      default:
        return value;
    }
  }

  public removeLeadingZeros(value: string): string {
    return value.replace(/^0+/, '');
  }

  public convertMonthStr(month: number): string {
    return this.months[(month)];
  }


  public getMaskValue(value: string): string {
    return `****${value.slice(value.length - 4)}`;
  }

}

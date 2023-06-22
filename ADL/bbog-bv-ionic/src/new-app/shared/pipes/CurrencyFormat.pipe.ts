import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'currencyFormatPipe'})
export class CurrencyFormatPipe implements PipeTransform {


  public static unFormat(value: string): string {
    return `${value}`
      .replace(/,/g, '')
      .replace('$', '');
  }

  public static format(value: string): string {
    if (!!value) {
      value = `${value}`;
      if (value.indexOf('.') >= 0) {
        const decimalPos = value.indexOf('.');
        let leftSide = value.substring(0, decimalPos);
        let rightSide = value.substring(decimalPos);

        leftSide = this.formatNumber(leftSide);
        rightSide = this.formatNumber(rightSide);

        leftSide = leftSide.length === 0 ? '0' : leftSide;

        rightSide = rightSide.substring(0, 2);
        // join number by .
        value = '$' + leftSide + '.' + rightSide;

      } else {
        value = this.formatNumber(value);
        value = '$' + value;
      }
    }
    return value;
  }

  private static formatNumber(n) {
    // format number 1000000 to 1,234,567
    return `${n}`.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  transform(value: string): string {
    return CurrencyFormatPipe.format(value);
  }

}

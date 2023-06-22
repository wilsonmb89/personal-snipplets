import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'period',
})
export class PeriodPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, args?: string) {
    if (args === 'mob') {
      return this.handleMobile(value);
    } else {
      return this.handleWeb(value);
    }
  }

  handleWeb(value: string): string {
    const t = value.replace('ENE', 'Enero')
    .replace('FEB', 'Febrero')
    .replace('MAR', 'Marzo')
    .replace('ABR', 'Abril')
    .replace('MAY', 'Mayo')
    .replace('JUN', 'Junio')
    .replace('JUL', 'Julio')
    .replace('AGO', 'Agosto')
    .replace('SEP', 'Septiembre')
    .replace('OCT', 'Octubre')
    .replace('NOV', 'Noviembre')
    .replace('DIC', 'Diciembre');
  return t;
  }

  handleMobile(value: string): string {
    const t = value.replace('ENE', 'Ene')
    .replace('FEB', 'Feb')
    .replace('MAR', 'Mar')
    .replace('ABR', 'Abr')
    .replace('MAY', 'May')
    .replace('JUN', 'Jun')
    .replace('JUL', 'Jul')
    .replace('AGO', 'Ago')
    .replace('SEP', 'Sep')
    .replace('OCT', 'Oct')
    .replace('NOV', 'Nov')
    .replace('DIC', 'Dic');
  return t;
  }
}

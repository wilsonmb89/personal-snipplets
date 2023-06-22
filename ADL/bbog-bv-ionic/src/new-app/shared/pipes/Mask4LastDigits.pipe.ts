import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'Mask4LastDigits'})
export class Mask4LastDigitsPipe implements PipeTransform {
  transform(value: string): string {
    return `****${value.substr(value.length - 4)}`;
  }
}

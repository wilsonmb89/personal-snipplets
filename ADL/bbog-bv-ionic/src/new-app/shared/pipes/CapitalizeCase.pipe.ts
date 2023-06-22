import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'capitalizeCasePipe'})
export class CapitalizeCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/(\s+|^)([a-z])/gi, function (c) {
      return c.toUpperCase();
    });
  }
}

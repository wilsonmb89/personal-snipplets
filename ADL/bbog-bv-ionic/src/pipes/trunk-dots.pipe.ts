

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'truncatedots'})
export class TruncateDotsPipe implements PipeTransform {
  transform(value: string, limitParam: string): string {
    const limit = parseInt(limitParam, 10);
    return ( value.length < limit  && limit > 0 ) ? value : value.substring(0, limit) + '...'  ;
  }
}

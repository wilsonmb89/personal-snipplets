import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TuPlusRs } from './tu-plus.model';
import { map } from 'rxjs/operators';
import {LoyaltyDelegateService} from '../../new-app/core/services-delegate/products-delegate/loyalty-delegate.service';


@Injectable()
export class TuPlusOpsProvider {

  constructor(
    private productsDelegateService: LoyaltyDelegateService
  ) { }

  public getPoints(): Observable<TuPlusRs> {
    return this.productsDelegateService.getLoyaltyBalance().pipe(map(loyaltyRs => {
      const tuPlusRs = new TuPlusRs();
      tuPlusRs.totalPoints = loyaltyRs.balance;
      tuPlusRs.partners = loyaltyRs.partners.map(partners => {
        return {
          name: partners.name,
          points: partners.balance
        };
      });
      return tuPlusRs;
    }));

  }

}




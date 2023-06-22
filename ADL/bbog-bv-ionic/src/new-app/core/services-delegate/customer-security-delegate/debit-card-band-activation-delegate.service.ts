import { Injectable } from '@angular/core';
import { CustomerSecurityService } from '@app/apis/customer-security/customer-security.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { BandActivationRq, DebitCardBandInfo } from '@app/apis/customer-security/models/debitCardBandActivations.model';

export enum BandActionsTypes {
  SAVE = 'save',
  UPDATE = 'update',
  DELETE = 'delete',
  FIND = 'find'
}

@Injectable()
export class DebitCardBandActivationDelegateService {


  constructor(private customerSecurityService: CustomerSecurityService) {
  }


  public actionActiveCard(action: BandActionsTypes,
                          accountId: string,
                          startActivationDate: Date,
                          endActivationDate: Date): Observable<DebitCardBandInfo[]> {

    accountId = accountId.slice(accountId.length - 4);
    switch (action) {
      case 'save':
        return this.customerSecurityService
          .debitCardBandActivationCreate(this.buildBody(accountId, startActivationDate, endActivationDate))
          .pipe(map(value => value.debitCardBandInfoList));
      case 'update':
        return this.customerSecurityService
          .debitCardBandActivationEdit(this.buildBody(accountId, startActivationDate, endActivationDate))
          .pipe(map(value => value.debitCardBandInfoList));
      case 'delete':
        return this.customerSecurityService
          .debitCardBandActivationDelete(this.buildBody(accountId, startActivationDate, endActivationDate))
          .pipe(map(value => value.debitCardBandInfoList));
      case 'find':
        return this.customerSecurityService
          .debitCardBandActivationFind(this.buildBody(accountId, null, null))
          .pipe(map((value) => value.debitCardBandInfoList));
    }
  }


  private buildBody(accountId: string, startActivationDate: Date, endActivationDate: Date): BandActivationRq {
    return {
      startActivationDate: (!!startActivationDate) ? startActivationDate.toISOString().slice(0, 10) : null,
      endActivationDate: (!!endActivationDate) ? endActivationDate.toISOString().slice(0, 10) : null,
      accountId
    };
  }

}

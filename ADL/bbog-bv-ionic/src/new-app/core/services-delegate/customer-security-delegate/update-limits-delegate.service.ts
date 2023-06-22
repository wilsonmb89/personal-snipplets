import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CustomerSecurityService } from '../../services-apis/customer-security/customer-security.service';
import { BankLimit, LimitUpdateRq, LimitUpdateRs } from '../../../core/services-apis/customer-security/models/limitUpdate.model';
import { LimitsRs } from '../../../../app/models/limits/get-accounts-limits-response';

@Injectable()
export class UpdateLimitsDelegateService {

  constructor(
    private customerSecurityService: CustomerSecurityService,
  ) {}

  public limitUpdate(accNumber: string, accType: string, limits: LimitsRs[]): Observable<LimitUpdateRs> {
    const limitUpdateRq = this.buildLimitUpdateRq(accNumber, accType, limits);
    return this.customerSecurityService.limitUpdate(limitUpdateRq);
  }

  private buildLimitUpdateRq(accNumber: string, accType: string, limits: LimitsRs[]): LimitUpdateRq {
    const bankLimit = new Array<BankLimit>();
    limits.forEach(
      limit => {
        const limitApi: BankLimit = {
          channel: limit.networkOwner,
          amount: limit.amount,
          count: limit.trnCount
        };
        bankLimit.push(limitApi);
      }
    );
    const request: LimitUpdateRq = {
      acctId: accNumber,
      acctType: accType,
      limits: bankLimit
    };
    return request;
  }
}

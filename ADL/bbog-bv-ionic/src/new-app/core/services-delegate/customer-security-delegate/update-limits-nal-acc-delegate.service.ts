import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CustomerSecurityService } from '../../services-apis/customer-security/customer-security.service';
import { BankLimitNatAcc, LimitUpdateNatAccRs, LimitUpdateNatAccRq } from '../../services-apis/customer-security/models/limitUpdateNatAcc.model';

@Injectable()
export class UpdateLimitsNalAccDelegateService {

  private readonly SDA_TRN_CODE = '0320';
  private readonly DDA_TRN_CODE = '5067';

  constructor(
    private customerSecurityService: CustomerSecurityService,
  ) {}

  public limitUpdateNatAcc(accNumber: string, accType: string, amount: string): Observable<LimitUpdateNatAccRs> {
    const limitUpdateNatAccRq = this.buildLimitUpdateNatAccRq(accNumber, accType, amount);
    return this.customerSecurityService.limitUpdateNatAcc(limitUpdateNatAccRq);
  }

  private buildLimitUpdateNatAccRq(accNumber: string, accType: string, amount: string): LimitUpdateNatAccRq {
    const bankLimitNatAcc = new Array<BankLimitNatAcc>();
    const limit: BankLimitNatAcc = {
      amount: amount,
      trnCode: (accType === 'SDA' ? this.SDA_TRN_CODE : (accType === 'DDA' ? this.DDA_TRN_CODE : '')),
      typeField: '0'
    };
    bankLimitNatAcc.push(limit);
    const request: LimitUpdateNatAccRq = {
      acctId: accNumber,
      acctType: accType,
      limits: bankLimitNatAcc
    };
    return request;
  }
}

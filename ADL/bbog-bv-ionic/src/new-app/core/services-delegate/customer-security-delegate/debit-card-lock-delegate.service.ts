import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CustomerSecurityService } from '@app/apis/customer-security/customer-security.service';
import { DebitCardLockRs, DebitCardLockRq } from '@app/apis/customer-security/models/debitCardLock.dto';

@Injectable()
export class DebitCardLockDelegateService {

  constructor(
    private customerSecurityService: CustomerSecurityService
  ) {}

  public debitCardLock(acctId: string, secretId: string): Observable<DebitCardLockRs> {
    const debitCardLockRq = new DebitCardLockRq(acctId, secretId);
    return this.customerSecurityService.debitCardLock(debitCardLockRq);
  }

}

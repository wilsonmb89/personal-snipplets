import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CustomerSecurityService } from '@app/apis/customer-security/customer-security.service';
import { DebitCardActivationRq, DebitCardActivationRs } from '@app/apis/customer-security/models/debitCardActivation.dto';

@Injectable()
export class DebitCardActivationDelegateService {

  constructor(
    private customerSecurityService: CustomerSecurityService
  ) {}

  public debitCardActivation(acctId: string, secretId: string): Observable<DebitCardActivationRs> {
    const debitCardActivationRq = new DebitCardActivationRq(acctId, secretId);
    return this.customerSecurityService.debitCardActivation(debitCardActivationRq);
  }

}

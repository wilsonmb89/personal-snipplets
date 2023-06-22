import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { DeleteAccountRq, DeleteAccountRs } from '../../services-apis/transfer/transfer-core/models/delete-account.model';
import { TransferCoreService } from '../../services-apis/transfer/transfer-core/transfer-core.service';
import { AccountBalance } from '../../../../app/models/enrolled-transfer/account-balance';

@Injectable()
export class AccountsDelegateService {

  constructor(
    private transferCoreService: TransferCoreService
  ) {}

  public deleteAccount(account: AccountBalance): Observable<DeleteAccountRs> {
    const { customer } = account;
    const bodyRq: DeleteAccountRq = {
      nickName: account.productAlias,
      targetAccountId: account.productNumber,
      targetAccountType: account.productType,
      targetBankId: account.bankId
    };
    if (customer) {
      bodyRq.targetName = customer.name;
      bodyRq.targetIdNumber = customer.identificationNumber;
      bodyRq.targetIdType = customer.identificationType;
    }
    return this.transferCoreService.deleteAccount(bodyRq);
  }

}

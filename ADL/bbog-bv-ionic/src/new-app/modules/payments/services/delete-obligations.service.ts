import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AccountBalance} from '../../../../app/models/enrolled-transfer/account-balance';
import {TransferCoreService} from '../../../core/services-apis/transfer/transfer-core/transfer-core.service';
import {ManageOblRq, ManageOblRs} from '../../../core/services-apis/transfer/transfer-core/models/manage-obl.model';
import {InMemoryKeys} from '../../../../providers/storage/in-memory.keys';
import {getValueDocumentTypeOpt} from '@app/shared/utils/bdb-constants/constants';
import {BdbStorageService} from '@app/shared/utils/bdb-storage-service/bdb-storage.service';

@Injectable()
export class DeleteObligationService {

  constructor(
    private transferCoreService: TransferCoreService,
    private bdbStorageService: BdbStorageService
  ) {}

  public deleteObligations(obligation: ManageOblRq): Observable<ManageOblRs> {
    return this.transferCoreService.deleteObligation(obligation);
  }

  public mapDeleteObligation(account: AccountBalance): ManageOblRq {
    return {
      targetAccountId: account.productNumber,
      targetAccountType: account.productType,
      targetAccountBankId: account.bankId,
      affiliationName: account.productAlias,
      targetIdNumber: this.bdbStorageService.getItemByKey(InMemoryKeys.IdentificationNumber),
      targetIdType: getValueDocumentTypeOpt(this.bdbStorageService.getItemByKey(InMemoryKeys.IdentificationType))
    };
  }
}

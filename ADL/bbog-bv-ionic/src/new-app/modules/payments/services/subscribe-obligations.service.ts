import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {TransferCoreService} from '../../../core/services-apis/transfer/transfer-core/transfer-core.service';
import {ManageOblRq, ManageOblRs} from '../../../core/services-apis/transfer/transfer-core/models/manage-obl.model';
import {InMemoryKeys} from '../../../../providers/storage/in-memory.keys';
import {BdbStorageService} from '../../../shared/utils/bdb-storage-service/bdb-storage.service';

@Injectable()
export class SubscribeObligationService {

  constructor(
    private transferCoreService: TransferCoreService,
    private bdbStorageService: BdbStorageService
  ) {}

  public subscribeObligations(): Observable<ManageOblRs> {
  const subscribeOblRq: ManageOblRq = this.bdbStorageService.getItemByKey(InMemoryKeys.ProductToEnroll);
    return this.transferCoreService.subscribeObligation(subscribeOblRq);
  }
}

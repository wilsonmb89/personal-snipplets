import { Injectable } from '@angular/core';
import {BalanceStatus} from '../../app/models/bdb-generics/bdb-constants';

@Injectable()
export class BalanceUtilsProvider {

  constructor() {}

  checkBalanceInquiryStatus(counterSuccess: number, counterError: number, arrayLength: number): BalanceStatus {
    const total = counterError + counterSuccess;
    const hasFinished = total === arrayLength;
    if (hasFinished && counterError > 0) {
      return BalanceStatus.FINISHED_WITH_ERROR;
    } else if (hasFinished) {
      return BalanceStatus.FINISHED;
    } else {
      return BalanceStatus.IN_PROCESS;
    }
  }

}

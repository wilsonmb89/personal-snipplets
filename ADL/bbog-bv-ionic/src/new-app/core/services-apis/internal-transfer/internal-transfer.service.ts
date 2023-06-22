import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClientWrapperProvider } from '../../http/http-client-wrapper/http-client-wrapper.service';
import { AddCreditCardAdvanceRq, AddCreditCardAdvanceRs } from './models/creditCardAdvance.model';

@Injectable()
export class InternalTransferService {

  private readonly ADD_CREDIT_CARD_ADVANCE = 'internal-transfer/credit-card-advance/add';

  constructor(
    private bdbHttp: HttpClientWrapperProvider
  ) {}

  public addCreditCardAdvance(body: AddCreditCardAdvanceRq): Observable<AddCreditCardAdvanceRs> {
    return this.bdbHttp.postToADLApi<AddCreditCardAdvanceRq, AddCreditCardAdvanceRs>(body, this.ADD_CREDIT_CARD_ADVANCE);
  }

}

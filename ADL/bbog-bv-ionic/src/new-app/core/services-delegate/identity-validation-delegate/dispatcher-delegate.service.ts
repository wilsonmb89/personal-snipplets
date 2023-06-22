import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ValidationApiService } from '../../services-apis/identity-validation/validation-api.service';
import {ValDispatcherRq, ValDispatcherRs} from '@app/apis/identity-validation/models/val-dispatcher.model';

@Injectable()
export class DispatcherDelegateService {

  constructor(
    private validationApiService: ValidationApiService
  ) {}

  public triggerDispatcher(): Observable<ValDispatcherRs> {
    return this.validationApiService.dispatch(this.buildDispatcherRq());
  }

  private buildDispatcherRq(): ValDispatcherRq {
    const p = {
      userFlow: '1'
    };
    return {
      accessType: 3,
      specificInfoForProduct: encodeURIComponent(JSON.stringify(p))
    };
  }

}

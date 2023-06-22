import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { UpdateBasicDataRq, UpdateBasicDataRs } from '@app/apis/customer-basic-data/models/updateBasicData.model';
import { CustomerBasicDataService } from '@app/apis/customer-basic-data/customer-basic-data.service';

@Injectable()
export class UpdateBasicDataService {

  constructor(
    private customerBasicDataService: CustomerBasicDataService
  ) {}

  public updateBasicDataDelegate(request: UpdateBasicDataRq): Observable<UpdateBasicDataRs> {
    return this.customerBasicDataService.updateBasicData(request);
  }
}

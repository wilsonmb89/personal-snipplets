import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { CustomerSecurityService } from '../../services-apis/customer-security/customer-security.service';
import { LimitInformationRq, LimitInformationRs } from '../../services-apis/customer-security/models/limitInformation.model';

@Injectable()
export class GetLimitsDelegateService {

  constructor(
    private customerSecurityService: CustomerSecurityService,
    private bdbUtils: BdbUtilsProvider,
  ) {}

  public limitInformation(account: ProductDetail): Observable<LimitInformationRs>  {
    return this.customerSecurityService
      .limitInformation(this.buildLimitInformationRq(account));
  }

  private buildLimitInformationRq(account: ProductDetail): LimitInformationRq {
    const request: LimitInformationRq = {
      acctId: account.productNumberApi,
      acctType: this.bdbUtils.mapTypeProduct(account.productType)
    };
    return request;
  }

}

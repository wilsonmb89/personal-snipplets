import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { ProductDetail } from '../../../../app/models/products/product-model';
import { CustomerSecurityService } from '../../../core/services-apis/customer-security/customer-security.service';
import { LimitInformationNatAccRq, LimitInformationNatAccRs } from '../../services-apis/customer-security/models/limitInformationNatAcc.model';

@Injectable()
export class GetLimitsNalAccDelegateService {

  constructor(
    private customerSecurityService: CustomerSecurityService,
    private bdbUtils: BdbUtilsProvider,
  ) {}

  public limitInformationNatAcc(account: ProductDetail): Observable<LimitInformationNatAccRs>  {
    return this.customerSecurityService
      .limitInformationNatAcc(this.buildLimitInformationRq(account));
  }

  // TODO: Delete use of mapTypeProduct, and verify the functionality
  private buildLimitInformationRq(account: ProductDetail): LimitInformationNatAccRq {
      const request: LimitInformationNatAccRq = {
      acctId: account.productNumberApi,
      acctType: this.bdbUtils.mapTypeProduct(account.productType)
    };
    return request;
  }

}

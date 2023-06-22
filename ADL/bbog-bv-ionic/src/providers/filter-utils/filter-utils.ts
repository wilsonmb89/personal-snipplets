import { Injectable } from '@angular/core';
import { ProductDetail } from '../../app/models/products/product-model';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';

@Injectable()
export class FilterUtilsProvider {

  constructor() { }

  getValidAccountsToPay(includeAFC = false): (p: ProductDetail) => boolean {
    return e => {
      const isSavingAccount = e.productType === BdbConstants.ATH_SAVINGS_ACCOUNT;
      const isCheckAccount = e.productType === BdbConstants.ATH_CHECK_ACCOUNT;
      const isAFCAccount = e.productType === BdbConstants.ATH_CUENTA_AFC;
      if (includeAFC) {
        return isSavingAccount || isCheckAccount || isAFCAccount;
      }
      return isSavingAccount || isCheckAccount;
    };
  }

  getAccountByType(typesReturn: string[]): (p: ProductDetail) => boolean {
    return e => {
      const findType = typesReturn.find( x => e.productType === x);
      return !!findType;
    };
  }
}

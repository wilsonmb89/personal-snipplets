import {Injectable} from '@angular/core';
import {BdbConstants} from '../../../../app/models/bdb-generics/bdb-constants';
import {ProductDetail} from '../../../../app/models/products/product-model';

@Injectable()
export class BalanceUtilsService {

  constructor() {}

  public getAmountKeyByProduct(product: ProductDetail): string {
    let key: string;
    if (product.category === BdbConstants.TARJETA_CREDITO_BBOG) {
      key = 'cupoComprasBBOG';
    } else if (product.productType === BdbConstants.ATH_CDT) {
      key = 'saldo_cdt';
    } else if (product.category === BdbConstants.FIDUCIAS_BBOG) {
      key = 'totalBBOG';
    } else if (product.productType === BdbConstants.ATH_CHECK_ACCOUNT
      || product.productType === BdbConstants.ATH_SAVINGS_ACCOUNT
      || product.productType === BdbConstants.ATH_CUENTA_AFC) {
      key = 'disponibleBBOG';
    } else if (this.isCredit(product)) {
      key = 'cupoDispoCreSerBBOG';
    } else if (product.productType === BdbConstants.ATH_CREDITO_HIP
     || product.productType === BdbConstants.ATH_LEASING_H
    ) {
      key = 'saldoCapitalBBOG';
    } else if (product.productType === BdbConstants.ATH_OTHER_CREDITS) {
      key = 'vlrTotPagCreSerBBOG';
    } else if (product.productType === BdbConstants.ATH_LEASING) {
      key = 'saldObligLeasingBBOG';
    } else if (product.productType === BdbConstants.ATH_LIBRANSA) {
      key = 'valTotPagarBBOG';
    } else {
      // todo: eliminar console cuando acabe la migracion
      console.error('________NOT KEY FOR BALANCE_______', product);
    }
    return key;
  }

  private  isCredit(f: ProductDetail): boolean {
    return f.productType === BdbConstants.ATH_ADELANTO_NOMINA ||
      f.productType === BdbConstants.ATH_CREDISERVICE_ALS_PNATURAL ||
      f.productType === BdbConstants.ATH_CREDISERVICE_AP ||
      f.productType === BdbConstants.ATH_ADVANCE_LEASING;
  }

}

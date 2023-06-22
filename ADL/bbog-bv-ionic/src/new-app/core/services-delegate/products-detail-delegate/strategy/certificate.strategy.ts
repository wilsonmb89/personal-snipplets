import { BalanceType } from '@app/apis/products/products-detail/products-detail.service';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { ProductsDetailStrategyI } from './products-detail-strategies';
import { BankProductTypes } from '@app/shared/utils/bdb-constants/products-constants';
import { GetBalancesByAccountRs } from '../../../../../providers/aval-ops/aval-ops-models';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';

/**
 * Cdt fisicos
 */
export const CertificateStrategy: ProductsDetailStrategyI = {
  balanceType(): BalanceType {
    return 'certificate';
  },

  criteria(productDetail: ApiProductDetail): boolean {
    return productDetail.productBankType === BankProductTypes.CDA;
  },

  mapperToOld(balanceInfo: ProductBalanceInfo, productAthType: string, bankId: string): GetBalancesByAccountRs {

    return {
      avalProductInfo: {
        bankId: bankId,
        acctType: productAthType,
        acctId: balanceInfo.accountId,
      },
      details: [
        {
          key: 'saldo_cdt',
          value: balanceInfo.balanceDetail['Orig']
        },
      ]
    };

  }
};

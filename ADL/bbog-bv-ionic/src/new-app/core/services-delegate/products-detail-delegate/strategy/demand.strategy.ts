import { BalanceType } from '@app/apis/products/products-detail/products-detail.service';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { ProductsDetailStrategyI } from './products-detail-strategies';
import { BankProductTypes } from '@app/shared/utils/bdb-constants/products-constants';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';
import { GetBalancesByAccountRs } from '../../../../../providers/aval-ops/aval-ops-models';

/**
 * Cuentas Corrientes
 */
export const DemandStrategy: ProductsDetailStrategyI = {
  balanceType(): BalanceType {
    return 'demand';
  },

  criteria(productDetail: ApiProductDetail): boolean {
    return productDetail.productBankType === BankProductTypes.DDA;
  },

  mapperToOld(balanceInfo: ProductBalanceInfo, productAthType: string, bankId: string): GetBalancesByAccountRs {
    return {
      avalProductInfo: {
        bankId:  bankId,
        acctType: productAthType,
        acctId: balanceInfo.accountId,
      },
      details: [
        {
          key: 'totalBBOG',
          value: balanceInfo.balanceDetail['Current']
        },
        {
          key: 'canjeBBOG',
          value: balanceInfo.balanceDetail['PendAuthAmt']
        },
        {
          key: 'disponibleBBOG',
          value: balanceInfo.balanceDetail['Avail']
        },
        {
          key: 'cupoSobgiroBBOG',
          value: balanceInfo.balanceDetail['CashLimit']
        },
        {
          key: 'sobgiroDispBBOG',
          value: balanceInfo.balanceDetail['CashAvail']
        },
        {
          key: 'diasSobgiroBBOG',
          value: balanceInfo.overdraftDays
        },
      ]

    };
  }
};

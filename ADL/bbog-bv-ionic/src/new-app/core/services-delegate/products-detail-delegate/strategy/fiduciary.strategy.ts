import { BalanceType } from '@app/apis/products/products-detail/products-detail.service';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { ProductsDetailStrategyI } from './products-detail-strategies';
import { BankProductTypes } from '@app/shared/utils/bdb-constants/products-constants';
import { GetBalancesByAccountRs } from '../../../../../providers/aval-ops/aval-ops-models';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';

export const FiduciaryStrategy: ProductsDetailStrategyI = {
  balanceType(): BalanceType {
    return 'fiduciary';
  },

  criteria(productDetail: ApiProductDetail): boolean {
    return productDetail.productBankType === BankProductTypes.FDA;
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
          key: 'totalBBOG',
          value: balanceInfo.balanceDetail['Current']
        },
        {
          key: 'canjeBBOG',
          value: balanceInfo.balanceDetail['PendAuthAmt'] // todo: pendiente por confirmar
        },
        {
          key: 'disponibleBBOG',
          value: balanceInfo.balanceDetail['Avail']
        },
        {
          key: 'rentBrutaBBOG',
          value: balanceInfo.balanceDetail['TotalHeld'] // todo: pendiente por confirmar
        },
        {
          key: 'fecVencBBOG',
          value: balanceInfo.expDate
        },
      ].filter(value => !!value.value)
    };
  }
};

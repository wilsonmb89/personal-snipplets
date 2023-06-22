import { BalanceType } from '@app/apis/products/products-detail/products-detail.service';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { ProductsDetailStrategyI } from './products-detail-strategies';
import { BankProductTypes } from '@app/shared/utils/bdb-constants/products-constants';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';
import { GetBalancesByAccountRs } from '../../../../../providers/aval-ops/aval-ops-models';


export const CreditCardStrategy: ProductsDetailStrategyI = {
  balanceType(): BalanceType {
    return 'credit-card';
  },

  criteria(productDetail: ApiProductDetail): boolean {
    return productDetail.productBankType === BankProductTypes.CCA;
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
          key: 'totalFechaBBOG',
          value: balanceInfo.balanceDetail['PayoffAmt']
        },
        {
          key: 'pagMinimoBBOG',
          value: balanceInfo.minPmtCurAmt
        },
        {
          key: 'fecProxPagoBBOG',
          value: balanceInfo.dueDt  // transform... to millis
        },
        {
          key: 'cupoComprasBBOG',
          value: balanceInfo.balanceDetail['AvailCredit']
        },
        {
          key: 'cupoTarjetaBBOG',
          value: balanceInfo.balanceDetail['CreditLimit']
        },
        {
          key: 'cupoAvancesBBOG',
          value: balanceInfo.balanceDetail['CashAvail']
        }
      ].filter(value => !!value.value)

    };
  }
};

export function isoDateToTime(isoDate: string): number {
  const date = new Date(isoDate);
  return date.getTime();
}

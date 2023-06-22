import { BalanceType } from '@app/apis/products/products-detail/products-detail.service';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { ProductsDetailStrategyI } from './products-detail-strategies';
import { BankProductTypes } from '@app/shared/utils/bdb-constants/products-constants';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';
import { GetBalancesByAccountRs } from '../../../../../providers/aval-ops/aval-ops-models';

/**
 * Creditos
 */
export const LoanStrategy: ProductsDetailStrategyI = {

  balanceType(): BalanceType {
    return 'loans';
  },

  criteria(productDetail: ApiProductDetail): boolean {
    return productDetail.productBankType === (BankProductTypes.LOC || BankProductTypes.DLA);
  },

  mapperToOld(balanceInfo: ProductBalanceInfo, productAthType: string, bankId: string): GetBalancesByAccountRs {
    return {
      avalProductInfo: {
        bankId: bankId,
        acctType: productAthType,
        acctId: balanceInfo.accountId,
      },
      details: getDetails(balanceInfo, productAthType)

    };

  }
};




const getDetailsLF = (balanceInfo: ProductBalanceInfo): any[] => {
  return [
    {
      key: 'oficRadicLeasingBBOG',
      value: '' // not used
    },
    {
      key: 'valObligLeasingBBOG',
      value: balanceInfo.balanceDetail['TotLoaAmt'] // TotLoaAmt, CreditLimit => similares
    },
    {
      key: 'saldObligLeasingBBOG',
      value: balanceInfo.balanceDetail['Principal']
    },
    {
      key: 'valorCanonLeasingBBOG',
      value: balanceInfo.nextPmtCurAmt
    },
    {
      key: 'fechaIniContLeasingBBOG',
      value: balanceInfo.openDt
    },
    {
      key: 'fechaOpcCompLeasingBBOG',
      value: balanceInfo.dueDt
    },
    {
      key: 'tasaCompLeasingBBOG',
      value: balanceInfo.feeDetails['Normal']
    },
    {
      key: 'tasaIntMoraLeasingBBOG',
      value: balanceInfo.feeDetails['Late']
    },
  ];
};



const getDetailLB = (balanceInfo: ProductBalanceInfo): any[] => {
  return [

    {
      key: 'valOriCredBBOG',
      value: balanceInfo.balanceDetail['TotLoaAmt']
    },
    {
      key: 'valTotPagarBBOG',
      value: balanceInfo.balanceDetail['PayoffAmt']
    },

    ];
};


const getDetailsLH = (balanceInfo: ProductBalanceInfo): any[] => {
  return [
    {
      key: 'oficinaRadicBBOG',
      value: ''// no se usa
    },
    {
      key: 'vlrObligBBOG',
      value: balanceInfo.balanceDetail['TotLoaAmt'] // CreditLimit, TotLoaAmt
    },
    {
      key: 'saldoCapitalBBOG',
      value: balanceInfo.balanceDetail['PayoffAmt']
    },
    {
      key: 'vlrPagCreHipBBOG',
      value: balanceInfo.nextPmtCurAmt
    },
    {
      key: 'fecProxPagoBBOG',
      value:  balanceInfo.dueDt
    },
    {
      key: 'fecInicialBBOG',
      value:  balanceInfo.openDt
    },
    {
      key: 'tasaNormalBBOG',
      value:  balanceInfo.feeDetails['Normal']
    },
    {
      key: 'tasaMoraBBOG',
      value: balanceInfo.feeDetails['Late']
    },

  ];
};





const getDetailsADANDN = (balanceInfo: ProductBalanceInfo): any[] => {
  return [
    {
      key: 'cupoTotCreSerBBOG',
      value: balanceInfo.balanceDetail['TotLoaAmt']
    },
    {
      key: 'cupoUtiCreSerBBOG',
      value: balanceInfo.balanceDetail['Principal'] // ? Principal | Outstanding
    },
    {
      key: 'cupoDispoCreSerBBOG',
      value: balanceInfo.balanceDetail['AvailCredit']
    },
    {
      key: 'vlrProxCuotaBBOG',
      value: balanceInfo.nextPmtCurAmt
    },
    {
      key: 'fecProxPagoBBOG',
      value: balanceInfo.dueDt
    },
    {
      key: 'vlrTotPagCreSerBBOG',
      value: balanceInfo.balanceDetail['PayoffAmt']
    },
    {
      key: 'intCorrienteBBOG',
      value: balanceInfo.feeDetails['Normal']
    },
    {
      key: 'intMoraBBOG',
      value: balanceInfo.feeDetails['Late']
    }

  ];
};

function getDetails(balanceInfo: ProductBalanceInfo, productAthType: string): any[] {
  switch (productAthType) {
    case 'AD':
    case 'AN':
    case 'DN':
    case 'LA':
    case 'AP':
      return getDetailsADANDN(balanceInfo);
    case 'LH':
    case 'AV':
      return getDetailsLH(balanceInfo);
    case 'LB':
      return getDetailLB(balanceInfo);
    case 'LF':
      return getDetailsLF(balanceInfo);
    default:
      console.error('___:Loan not mapped => ath type ', productAthType, balanceInfo);
  }

}

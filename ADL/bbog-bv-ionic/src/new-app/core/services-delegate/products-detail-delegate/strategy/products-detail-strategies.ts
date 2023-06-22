import { BalanceType } from '@app/apis/products/products-detail/products-detail.service';
import { ApiProductDetail } from '@app/apis/products/products/models/products';
import { LoanStrategy } from './loan.strategy';
import { FiduciaryStrategy } from './fiduciary.strategy';
import { CertificateStrategy } from './certificate.strategy';
import { CreditCardStrategy } from './credit-card.strategy';
import { DemandStrategy } from './demand.strategy';
import { SavingsStrategy } from './savings.strategy';
import { ProductBalanceInfo } from '@app/apis/products/products-detail/models/GetBalanceRs';
import { GetBalancesByAccountRs } from '../../../../../providers/aval-ops/aval-ops-models';

export interface ProductsDetailStrategyI {
  balanceType(): BalanceType;

  criteria(productDetail: ApiProductDetail): boolean;

  mapperToOld(productBalanceInfo: ProductBalanceInfo, productAthType: string, bankId: string): GetBalancesByAccountRs;

}

export const balanceStrategies: ProductsDetailStrategyI[] = [
  CertificateStrategy,
  CreditCardStrategy,
  DemandStrategy,
  FiduciaryStrategy,
  LoanStrategy,
  SavingsStrategy
];

export function getStrategy(apiProductDetail: ApiProductDetail): ProductsDetailStrategyI {
  return balanceStrategies.find(strategy => strategy.criteria(apiProductDetail));
}


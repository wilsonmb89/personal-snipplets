import { Injectable } from '@angular/core';
import { BdbConstants, BalanceStatus } from '../../app/models/bdb-generics/bdb-constants';
import { ProductDetail, mapDetailsBalance } from '../../app/models/products/product-model';
import { PCardModel } from '../../providers/cards-mapper/cards-mapper';
import { BdbMaskProvider } from '../../providers/bdb-mask/bdb-mask';
import { AvalOpsProvider } from '../../providers/aval-ops/aval-ops';
import { GetBalancesByAccountRs } from 'providers/aval-ops/aval-ops-models';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { BalanceUtilsProvider } from '../../providers/balance-utils/balance-utils';
import {BalanceUtilsService} from '@app/shared/utils/bdb-balance-utils/balance-utils.service';

@Injectable()
export class UnknownBalanceProvider {

  constructor(
    private bdbMask: BdbMaskProvider,
    private avalOps: AvalOpsProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private balanceUtils: BalanceUtilsProvider,
    private balanceUtilsService: BalanceUtilsService
  ) { }

  addCreditLineBar(category: string, productType: string): boolean {
    return category === BdbConstants.TARJETA_CREDITO_BBOG ||
      (category === BdbConstants.CREDITOS_BBOG &&
        (productType === BdbConstants.ATH_ADELANTO_NOMINA ||
          productType === BdbConstants.ATH_CREDISERVICE_ALS_PNATURAL ||
          productType === BdbConstants.ATH_CREDISERVICE_AP));
  }

  hasNextPayment(e: ProductDetail): boolean {
    let hasPayment = false;
    if (e.category === BdbConstants.TARJETA_CREDITO_BBOG) {
      hasPayment = e.balanceDetail.pagMinimoBBOG > 0;
    } else if (e.category === BdbConstants.CREDITOS_BBOG && e.productType === BdbConstants.ATH_CREDITO_HIP) {
      hasPayment = e.balanceDetail.vlrPagCreHipBBOG > 0;
    } else if (e.category === BdbConstants.CREDITOS_BBOG) {
      hasPayment = e.balanceDetail.vlrProxCuotaBBOG > 0;
    }
    return hasPayment;
  }

  private updateBalanceByKey(tempCard: PCardModel, product: ProductDetail, property: string) {
    tempCard.pBalance.key = BdbConstants.namedMap[property].label;
    tempCard.pBalance.value = this.bdbMask.maskFormatFactory(
      product.balanceDetail[property], BdbConstants.namedMap[property].format);
    product.amount = product.balanceDetail[property];
    product.description = BdbConstants.namedMap[property].label;
  }

  updateBalance(tempCard: PCardModel, product: ProductDetail) {
  const key = this.balanceUtilsService.getAmountKeyByProduct(product);
    if (!!key) {
      this.updateBalanceByKey(tempCard, product, key);
    }
  }

  loadAccountBalances(accountsToLoad: ProductDetail[], whenFinish: (data: any) => void) {
    if (accountsToLoad.length === 0) {
      whenFinish(BalanceStatus.FINISHED);
      return;
    }
    let counterSuccess = 0;
    let counterError = 0;
    const accountsLength = accountsToLoad.length;
    accountsToLoad.forEach(e => {
      if (e.balanceDetail && e.balanceDetail !== {}) {
        counterSuccess++;
        const monitorRs = this.monitorBalances(counterSuccess, counterError, accountsLength);
        whenFinish(monitorRs);
      } else {
        this.avalOps.getBalancesByAccount(e).subscribe(
          (data: GetBalancesByAccountRs) => {
            counterSuccess++;
            const monitorRs = this.monitorBalances(counterSuccess, counterError, accountsLength);
            const bDetail = mapDetailsBalance(data.details);
            e.balanceDetail = bDetail;
            e.amount = e.balanceDetail.disponibleBBOG;
            e.description = BdbConstants.namedMap.disponibleBBOG.label;
            whenFinish(monitorRs);
          },
          (err) => {
            counterError++;
            const monitorRs = this.monitorBalances(counterSuccess, counterError, accountsLength);
            whenFinish(monitorRs);
          }
        );
      }
    });
  }

  monitorBalances(counterSuccess: number, counterError: number, arrayLength: number): BalanceStatus {
    return this.balanceUtils.checkBalanceInquiryStatus(counterSuccess, counterError, arrayLength);
  }
}

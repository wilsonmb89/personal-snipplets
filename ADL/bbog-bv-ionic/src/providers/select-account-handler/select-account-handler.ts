import { Injectable } from '@angular/core';
import { ProductDetail } from '../../app/models/products/product-model';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { FunnelEventsProvider } from '../funnel-events/funnel-events';
import { FunnelKeyModel } from '../funnel-keys/funnel-key-model';
import { ProgressBarProvider } from '../progress-bar/progress-bar';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { AccessDetailProvider } from '../access-detail/access-detail';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { FilterUtilsProvider } from '../filter-utils/filter-utils';
import { AvalOpsProvider } from '../../providers/aval-ops/aval-ops';
import { CurrencyFormatPipe } from '@app/shared/pipes/CurrencyFormat.pipe';

@Injectable()
export class SelectAccountHandlerProvider {

  constructor(
    private funnelEvents: FunnelEventsProvider,
    private progressBar: ProgressBarProvider,
    private bdbInMemory: BdbInMemoryProvider,
    private accessDetail: AccessDetailProvider,
    private filterUtils: FilterUtilsProvider,
    private avalOps: AvalOpsProvider,
  ) { }
  /**
   * This method return the savings and check accounts of a customer
   * @param withAvailableFunds set to true if products with balance greater than $ 0 are needed
   * @param includeAFC set to true if AFC accounts need to be shown
   * @param accountToCompare optional account to filter for transfer between own products
   * @returns an array of Product Detail
   */
  getAccountsAvailable(withAvailableFunds: boolean, includeAFC = false, accountToCompare?: ProductDetail): Array<ProductDetail> {
    let customerProducts: Array<ProductDetail> = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    customerProducts = !!customerProducts ? customerProducts : [];
    const availableAccounts: Array<ProductDetail> = customerProducts.filter(this.filterUtils.getValidAccountsToPay(includeAFC));
    return this.validateCard(availableAccounts, withAvailableFunds, accountToCompare);
  }
  /**
   * It takes an account as parameter and decides wether
   * it has a valid amount to pay
   * Note: Valid for savings and check accounts
   * @param e account to validate
   * @returns the account if valid or null if invalid
   */
  validateAmounts(e: ProductDetail): ProductDetail {
    if (e.productType === BdbConstants.ATH_CHECK_ACCOUNT && e.amount < 1) {
      if (e.balanceDetail && e.balanceDetail !== {}) {
        const overdraftLimit = e.balanceDetail.cupoSobgiroBBOG;
        const overdraftUsed = e.balanceDetail.sobgiroDispBBOG;
        if (overdraftLimit - overdraftUsed > 0) {
          return e;
        }
      }
      return null;
    } else {
      return e.amount > 0 ? e : null;
    }
  }

  /**
   * This method returns an array for mapping bdb-check-cards
   * @param accounts Filtered accounts available for payment
   * @returns a custom array {cardTitle, cardLabel, cardValue, isActive, acct}
   */
  getCardsMapping(accounts: Array<ProductDetail>): Array<{ cardTitle, cardLabel, cardValue, isActive, acct }> {
    return accounts.map((e: ProductDetail) => {
      if (accounts.length === 1) {
        e.isActive = true;
      }
      return {
        cardTitle: e.productName,
        cardLabel: e.productNumber,
        cardValue: e.amount,
        isActive: e.isActive,
        acct: e
      };
    });
  }
  /**
   * This method pre-select an account if there is only one available or if has been pre-selected from detail cards
   * @param accounts Filtered accounts available for payment
   * @param _funnel funnel key for grafana
   * @returns null if no account has been set or Object of ProductDetail if an account has been set
   */
  setFirstAccountSelection(accounts: Array<ProductDetail>, _funnel: FunnelKeyModel): ProductDetail {
    if (accounts.length === 1) {
      const acct: ProductDetail = accounts[0];
      this.updateSelectedAccount(acct, _funnel);
      return acct;
    } else if (this.accessDetail.isOriginSelected()) {
      this.updateSelectedAccount(this.accessDetail.getOriginSelected(), _funnel);
      return this.accessDetail.getOriginSelected();
    } else {
      return null;
    }
  }
  /**
   * this method notifies the funnel wether an account has been set to payment
   * @param acct account selected for payment
   * @param _funnel key for grafana funnel
   */
  updateSelectedAccount(acct: ProductDetail, _funnel: FunnelKeyModel) {
    this.funnelEvents.callFunnel(_funnel, _funnel.steps.account);
    acct.isActive = true;
    this.updatePaymentProgressBar(acct);

  }
  /**
   * sets up a payment in progressBar
   * @param acct account to show in the progress Bar
   * @param step step to modify in the progressBar, is set to step 3(payment method) by default
   */
  updatePaymentProgressBar(acct: ProductDetail, step = BdbConstants.PROGBAR_STEP_3) {
    const pName = acct.productType === 'ST' ? 'Ahorros' : 'Corriente';
    this.progressBar.setDetails(step, [
      `${pName} No. ${acct.productNumber}`
    ]);
    this.progressBar.setDone(step, true);
  }
  /**
   * sets up amount selected in progressBar
   * @param amount amount to show in the progress Bar
   * @param cost cost of the transaction to display
   */
  updateAmountProgressBar(amount: string, cost: string) {
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_2, [CurrencyFormatPipe.format(amount), `Costo: ${cost}`]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_2, true);
  }
  /**
   * set up payment and update progressBar
   * @param item account selected of type {cardTitle, cardLabel, cardValue, isActive, acct}
   * @param _funnel funnel key for grafana
   * @param step step to update in progressBar
   */
  paymentSelected(item, _funnel, step?) {
    this.funnelEvents.callFunnel(_funnel, _funnel.steps.account);
    item.isActive = true;
    const acct: ProductDetail = item.acct;
    this.updatePaymentProgressBar(acct, step);
  }


  /**
   * This method return the savings and check accounts by type of a customer
   * @param withAvailableFunds set to true if products with balance greater than $0 are needed
   * @param listAccount set list type  accounts need to be shown
   * @param accountToCompare optional account to filter for transfer between own products
   * @returns an array of Product Detail
   */
  getAccountsByType(withAvailableFunds: boolean, listAccount?: string[], accountToCompare?: ProductDetail): Array<ProductDetail> {
    let customerProducts: Array<ProductDetail> = this.bdbInMemory.getItemByKey(InMemoryKeys.CustomerProductList);
    customerProducts = !!customerProducts ? customerProducts : [];
    const availableAccounts: Array<ProductDetail> = customerProducts.filter(this.filterUtils.getAccountByType(listAccount));
    return this.validateCard(availableAccounts, withAvailableFunds, accountToCompare);
  }

  private validateCard(availableAccounts: ProductDetail[], withAvailableFunds: boolean, accountToCompare: ProductDetail): ProductDetail[] {
      return availableAccounts.filter((e: ProductDetail) => {
      if (this.accessDetail.isOriginSelected()) {
        if (this.accessDetail.getOriginSelected().productNumber === e.productNumber) {
          e.isActive = true;
        }
      }
      if (withAvailableFunds && accountToCompare) {
        return this.validateAmounts(e) !== null && e.productNumber !== accountToCompare.productNumber;
      }  else if (withAvailableFunds) {
        return this.validateAmounts(e) !== null;
      }  else if (accountToCompare) {
        return e.productNumber !== accountToCompare.productNumber;
      }  else {
        return e;
      }
    });
  }
}

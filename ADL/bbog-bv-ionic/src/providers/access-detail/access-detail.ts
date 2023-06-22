import { Injectable } from '@angular/core';
import { ProductDetail } from '../../app/models/products/product-model';
import { BdbConstants } from '../../app/models/bdb-generics/bdb-constants';
import { ProgressBarProvider } from '../progress-bar/progress-bar';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { MaskType } from '../bdb-mask/bdb-mask-type.enum';

@Injectable()
export class AccessDetailProvider {

  constructor(
    private progressBar: ProgressBarProvider,
    private bdbMask: BdbMaskProvider,
    private bdbInMemory: BdbInMemoryProvider
  ) { }

  isOriginSelected(): boolean {
    const productDetail: ProductDetail = this.bdbInMemory.getItemByKey(InMemoryKeys.TransferOrigin);
    return !!productDetail;
  }

  setOriginSelected(account: ProductDetail) {
    this.bdbInMemory.setItemByKey(InMemoryKeys.TransferOrigin, account);
  }

  getOriginSelected(): ProductDetail {
    return this.bdbInMemory.getItemByKey(InMemoryKeys.TransferOrigin);
  }

  unselectedOrigin() {
    this.bdbInMemory.clearItem(InMemoryKeys.TransferOrigin);
  }

  isDestinationSelected(): boolean {
    const productDetail: ProductDetail = this.bdbInMemory.getItemByKey(InMemoryKeys.DestinationOrigin);
    return !!productDetail;
  }

  setDestinationSelected(account: ProductDetail) {
    this.bdbInMemory.setItemByKey(InMemoryKeys.DestinationOrigin, account);
  }

  getDestinationSelected(): ProductDetail {
    return this.bdbInMemory.getItemByKey(InMemoryKeys.DestinationOrigin);
  }

  unselectedDestination() {
    this.bdbInMemory.clearItem(InMemoryKeys.DestinationOrigin);
  }

  updateProgressBarDone(product: ProductDetail) {
    const accType = this.getNameAccount(product);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_3, [
      `${accType}: ${product.productNumber}`,
      `Disponible: ${this.bdbMask.maskFormatFactory(product.amount, MaskType.CURRENCY)}`
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_3, true);
  }

  updateProgressBarDoneRecharge(product: ProductDetail) {
    const accType = this.getNameAccount(product);
    this.progressBar.setDetails(BdbConstants.PROGBAR_STEP_4, [
      `${accType}: ${product.productNumber}`,
      `Disponible: ${this.bdbMask.maskFormatFactory(product.amount, MaskType.CURRENCY)}`
    ]);
    this.progressBar.setDone(BdbConstants.PROGBAR_STEP_4, true);
  }

  getNameAccount(product: ProductDetail): string {
    if (product.productType === BdbConstants.ATH_SAVINGS_ACCOUNT) {
      return 'Ahorros No';
    } else if (product.productType === BdbConstants.ATH_CHECK_ACCOUNT) {
      return 'Corriente No';
    } else {
      return '';
    }
  }

}

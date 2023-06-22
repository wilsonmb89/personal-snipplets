import { Injectable } from '@angular/core';
import { InMemoryKeys } from '../in-memory.keys';
import { InMemoryGeneric } from '../in-memory-generic';
import { BdbCryptoForgeProvider } from '../../bdb-crypto-forge/bdb-crypto-forge';
import { ClearStateFacade } from '../../../app/store/facades/clear-state.facade';

@Injectable()
export class BdbInMemoryProvider {

  constructor(
    private bdbCryptoForgeProvider: BdbCryptoForgeProvider,
    private clearStateFacade: ClearStateFacade
  ) { }

  setItemByKey(key: InMemoryKeys, data: any): void {

    if (data !== undefined || data !== null) {
      sessionStorage.setItem(btoa(key), this.bdbCryptoForgeProvider.encrypt(data));
    }
  }

  setItemByGenericKey<T>(inMemory: InMemoryGeneric<T>, data: any): void {
    if (data !== undefined || data !== null) {
      sessionStorage.setItem(btoa(inMemory.key), this.bdbCryptoForgeProvider.encrypt(data));
    }
  }

  getItemByKey(key: InMemoryKeys): any {
    const cipherText = sessionStorage.getItem(btoa(key));
    if (cipherText === null) {
      return null;
    }
    return this.bdbCryptoForgeProvider.decrypt(cipherText);
  }

  clearItem(key: string): void {
    sessionStorage.removeItem(btoa(key));
  }

  getAll(): any {
    return sessionStorage;
  }

  clearAll() {
    const tmpIp = this.getItemByKey(InMemoryKeys.IP);
    const tmpHasDeviceId = this.getItemByKey(InMemoryKeys.HasDeviceId);
    const dataToLogin = this.getItemByKey(InMemoryKeys.DataToLogin);
    let tmpDeviceId;
    let tmpModel;
    if (tmpHasDeviceId) {
      tmpDeviceId = this.getItemByKey(InMemoryKeys.DeviceId);
      tmpModel = this.getItemByKey(InMemoryKeys.Model);
    }
    sessionStorage.clear();
    this.setItemByKey(InMemoryKeys.IP, tmpIp);
    this.setItemByKey(InMemoryKeys.HasDeviceId, tmpHasDeviceId);
    this.setItemByKey(InMemoryKeys.HasDeviceId, tmpHasDeviceId);
    this.setItemByKey(InMemoryKeys.UserLogout, true);
    this.setItemByKey(InMemoryKeys.DataToLogin, dataToLogin);

    if (tmpHasDeviceId) {
      this.setItemByKey(InMemoryKeys.DeviceId, tmpDeviceId);
      this.setItemByKey(InMemoryKeys.Model, tmpModel);
    }
    this.clearStateFacade.logoutState();
  }

  setItemByCryptId(key: InMemoryKeys, id: string): void {
    sessionStorage.setItem(btoa(key), this.bdbCryptoForgeProvider.encryptId(id));
  }

  getItemByCryptId(key: InMemoryKeys): string {
    return sessionStorage.getItem(btoa(key));
  }

}

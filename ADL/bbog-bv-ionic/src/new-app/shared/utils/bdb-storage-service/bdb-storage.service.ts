import { Injectable } from '@angular/core';
import { BdbCypherService } from '../bdb-cypher-service/bdb-cypher.service';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { InMemoryGeneric } from '../../../../providers/storage/in-memory-generic';

@Injectable()
export class BdbStorageService {

  constructor(private bdbCypherService: BdbCypherService) {
  }

  public setSavedState(state: any, localStorageKey: string) {
    sessionStorage.setItem(btoa(localStorageKey), this.bdbCypherService.bdbEncrypt(JSON.stringify(state)));
  }

  public getSavedState(localStorageKey: string): any {
    const cipherText = sessionStorage.getItem(btoa(localStorageKey));
    if (cipherText === null) {
      return null;
    }
    return this.bdbCypherService.bdbDecrypt(cipherText);
  }

  public setItemByKey(key: InMemoryKeys, data: any): void {
    if (data !== undefined || data !== null) {
      sessionStorage.setItem(btoa(key), this.bdbCypherService.bdbEncrypt(JSON.stringify(data)));
    }
  }

  public setItemByGenericKey<T>(inMemory: InMemoryGeneric<T>, data: any): void {
    if (data !== undefined || data !== null) {
      sessionStorage.setItem(btoa(inMemory.key), this.bdbCypherService.bdbEncrypt(JSON.stringify(data)));
    }
  }

  public getItemByKey(key: InMemoryKeys): any {
    const cipherText = sessionStorage.getItem(btoa(key));
    if (cipherText === null) {
      return null;
    }
    return this.bdbCypherService.bdbDecrypt(cipherText);
  }

  public clearItem(key: string): void {
    sessionStorage.removeItem(btoa(key));
  }

  public getAll(): any {
    return sessionStorage;
  }

  public clearAll(): void {
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
  }

  public setItemByCryptId(key: InMemoryKeys, id: string): void {
    sessionStorage.setItem(btoa(key), this.bdbCypherService.bdbEncrypt(id));
  }

  public getItemByCryptId(key: InMemoryKeys): string {
    return sessionStorage.getItem(btoa(key));
  }



}

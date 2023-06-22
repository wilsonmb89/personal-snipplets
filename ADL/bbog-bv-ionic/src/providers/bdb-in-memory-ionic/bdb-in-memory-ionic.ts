import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { BdbCryptoForgeProvider } from '../bdb-crypto-forge/bdb-crypto-forge';


@Injectable()
export class BdbInMemoryIonicProvider {

  constructor(
    private bdbCryptoForgeProvider: BdbCryptoForgeProvider,
    private storageIonic: Storage
  ) {}

  set(key: InMemoryKeys, data: any): Promise<any> {
    if (data !== undefined || data !== null) {
      return this.storageIonic.set(btoa(key), this.bdbCryptoForgeProvider.encrypt(data));
    } else {
      return Promise.reject(new Error('fail'));
    }
  }

  remove(key: InMemoryKeys): Promise<any> {
    return this.storageIonic.remove(btoa(key));
  }

  get(key: InMemoryKeys): Promise<any> {
    return this.storageIonic.get(btoa(key)).then(
      (cipherText) => {
        if (cipherText === null) {
          return null;
        }
        return this.bdbCryptoForgeProvider.decrypt(cipherText);
      }
    );
  }
}

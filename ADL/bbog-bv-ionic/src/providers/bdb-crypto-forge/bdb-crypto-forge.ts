import { Injectable } from '@angular/core';
import { BdbHashBaseProvider } from '../bdb-hash-base/bdb-hash-base';
import * as forge from 'node-forge';


/**
 * Deprecated: please use 'BdbCypherService' in new-app folder
 */
@Injectable()
export class BdbCryptoForgeProvider {

  hashBaseDevice: any;
  sha1HashKey: any;

  constructor(
    private bdbHashBaseProvider: BdbHashBaseProvider
  ) {}

  getHashDevice() {
    this.hashBaseDevice = !!this.hashBaseDevice ? this.hashBaseDevice : this.bdbHashBaseProvider.getHashFromDevice();
    if (!(!!this.sha1HashKey)) {
      forge.options.usePureJavaScript = true;
      const md = forge.md.sha1.create();
      md.update(this.hashBaseDevice);
      this.sha1HashKey = md.digest().getBytes(16);
    }
    return this.sha1HashKey;
  }

  encrypt(data: any): string {
    const cipher = forge.cipher.createCipher('AES-ECB', this.getHashDevice());
    cipher.start();
    cipher.update(forge.util.createBuffer(JSON.stringify(data)));
    cipher.finish();
    return cipher.output.data;
  }

  decrypt(cipherText: string) {
    try {
      const decipher = forge.cipher.createDecipher('AES-ECB', this.getHashDevice());
      decipher.start();
      decipher.update(forge.util.createBuffer(cipherText));
      decipher.finish();
      return this.parseItem(decipher.output.data);
    } catch (err) {
      return null;
    }
  }

  parseItem(item: any) {
    if (item === null || item === undefined || item === '') {
      return null;
    }
    return JSON.parse(item);
  }

  encryptId(id: string): string {
    const cipher = forge.cipher.createCipher('AES-ECB', this.getHashDevice());
    cipher.start();
    cipher.update(forge.util.createBuffer(id));
    cipher.finish();
    return cipher.output.data;
  }

}

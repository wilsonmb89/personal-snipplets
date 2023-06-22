import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ENV } from '@app/env';

@Injectable()
export class BdbCryptoProvider {

  constructor() {
  }

  encrypt(data: any): string {
    const cipherText = CryptoJS.AES.encrypt(JSON.stringify(data), ENV.CYPHER_JS_KEY);
    return cipherText.toString();
  }

  decrypt(cipherText: string) {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENV.CYPHER_JS_KEY);
    return this.parseItem(bytes.toString(CryptoJS.enc.Utf8));
  }

  parseItem(item: any) {
    if (item === null || item === undefined || item === '') {
      return null;
    }
    return JSON.parse(item);
  }

  encryptId(id: string): string {
    const cipherText = CryptoJS.AES.encrypt(id, ENV.CYPHER_JS_KEY);

    return cipherText.toString();

  }

}

import { Injectable } from '@angular/core';
import { JSEncrypt } from 'jsencrypt';
import { ENV } from '@app/env';

@Injectable()
export class BdbRsaProvider {

  constructor() {
  }

  encrypt(data: any, balYekCilbup?: string): string {
    if (data === null || data === undefined) {
      return null;
    }
    const isDevelopment = ENV.STAGE_NAME !== 'dev';
    if (isDevelopment) {
      const jsEncrypt = new JSEncrypt();
      const initialPart = atob('LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0=');
      const finalPart = atob('LS0tLS1FTkQgUFVCTElDIEtFWS0tLS0t');
      if (balYekCilbup) {
        jsEncrypt.setPublicKey(initialPart + balYekCilbup + finalPart);
      } else {
        jsEncrypt.setPublicKey(initialPart + ENV.BAL_YEK_CILBUP_1 + finalPart);
      }
      const encrypted = jsEncrypt.encrypt(data.toString());
      return encrypted;
    } else {
      return data;
    }
  }

}

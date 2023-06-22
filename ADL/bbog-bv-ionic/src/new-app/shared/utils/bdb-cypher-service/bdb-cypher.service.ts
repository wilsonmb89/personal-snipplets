import { Injectable } from '@angular/core';
import * as forge from 'node-forge';

@Injectable()
export class BdbCypherService {

  private hashBaseDevice: string;
  private sha1HashKey: any;


  public toSha256(data: string): string {
    const md = forge.md.sha256.create();
    md.update(data);
    return md.digest().toHex();
  }


  public bdbEncrypt(data: string): string {
    const cipher = forge.cipher.createCipher('AES-ECB', this.getHashDevice());
    cipher.start();
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    return cipher.output.data;
  }

  public bdbDecrypt(cipherText: string): string {
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



  private parseItem(item: any): string {
    if (item === null || item === undefined || item === '') {
      return null;
    }
    return JSON.parse(item);
  }

  private getHashDevice(): string {
    this.hashBaseDevice = !!this.hashBaseDevice ? this.hashBaseDevice : this.getHashFromDevice();
    if (!(!!this.sha1HashKey)) {
      forge.options.usePureJavaScript = true;
      const md = forge.md.sha1.create();
      md.update(this.hashBaseDevice);
      this.sha1HashKey = md.digest().getBytes(16);
    }
    return this.sha1HashKey;
  }



  private getCanvasProps() {
    return (
      () => {
        try {
          const canvasVal = document.createElement('canvas');
          const ctx = canvasVal.getContext('2d');
          ctx.textBaseline = 'top';
          ctx.font = '14px \'Arial\'';
          ctx.textBaseline = 'alphabetic';
          ctx.fillStyle = '#f60';
          ctx.fillRect(125, 1, 62, 20);
          ctx.fillStyle = '#069';
          ctx.fillText('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:\',<.>/?', 2, 15);
          ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
          ctx.fillText('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:\',<.>/?', 4, 17);

          return canvasVal.toDataURL();
        } catch (error) {
          return error;
        }
      }
    )();
  }


  public getHashFromDevice(): string {
    const { userAgent, language, languages, hardwareConcurrency } = window.navigator;
    const { colorDepth, availWidth, availHeight } = window.screen;
    const timezoneOffset = new Date().getTimezoneOffset();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const touchSupport = 'ontouchstart' in window;
    const canvas = this.getCanvasProps();

    return JSON.stringify({
      userAgent,
      language,
      languages,
      hardwareConcurrency,
      colorDepth,
      availWidth,
      availHeight,
      timezoneOffset,
      timezone,
      touchSupport,
      canvas
    });
  }



}

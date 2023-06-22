import { Injectable } from '@angular/core';

@Injectable()
export class BdbHashBaseProvider {

  constructor() { }

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

          const result = canvasVal.toDataURL();
          return result;
        } catch (error) {
          return error;
        }
      }
    )();
  }

  getHashFromDevice() {
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

import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class BdbPlatformsProvider {

  private desktopType = 'core';
  private mobileWebType = 'mobileweb';

  constructor(
    private plt: Platform
  ) { }

  public getDeviceHeight() {
    return this.plt.height();
  }

  public isMobile(): boolean {
    return this.plt.width() <= 540 && this.plt.width() > 0;
  }

  public isBrowser() {
    return window.innerWidth > 768;
  }

  public isApp(): boolean {
    const platforms = this.plt.platforms();
    return platforms.indexOf(this.desktopType) === -1 && platforms.indexOf(this.mobileWebType) === -1;
  }

  public isTablet() {
    return this.plt.width() <= 768 && this.plt.width() > 540;
  }

  public isMobileBrowser(): boolean {
    return this.plt.is(this.mobileWebType);
  }

  public isWebBrowser(): boolean {
    return this.plt.is(this.desktopType);
  }

  public getVersionBrowser(): any {
    const ua = navigator.userAgent;
    let tem;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) {
        return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
      return M.join(' ');
    }

  }

  /**
   * detect IE
   * returns version of IE or false, if browser is not Internet Explorer
   */
  detectIE() {
    const ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // tslint:disable-next-line: max-line-length
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    const edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
  }

  getBrowserInfo() {
    // tslint:disable-next-line: no-var-keyword prefer-const
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return { name: 'IE ', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\bOPR\/(\d+)/);
      if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
      name: M[0],
      version: M[1]
    };
  }

  isCallBlockPlatform() {
    const browser = this.getBrowserInfo();
    browser.name = browser.name.replace(' ', '');
    return (browser.name === 'MSIE' || browser.name === 'IE') || (browser.name === 'Safari' && parseInt(browser.version, 10) <= 6);
  }

}

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ModalController } from 'ionic-angular';
import { mockApp, mockConfig, mockDeepLinker } from 'ionic-angular/util/mock-providers';
import { IdleExpiry } from '@ng-idle/core';
import { Device } from '@ionic-native/device';


export class PlatformMock {
  public ready(): Promise<string> {
    return new Promise((resolve) => {
      resolve('READY');
    });
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class DeviceMock extends Device {
  uuid = null;
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}

export class NavMock {

  public pop(): any {
    return this.mockPromise('pop');

  }

  public push(): any {
    return this.mockPromise('push');
  }

  private mockPromise(type): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): void {
    return;
  }

}

export class DeepLinkerMock {

}

export class LoadingMock {
  public static instance(): any {
    const instance = jasmine.createSpyObj('Loading', ['present', 'dismiss', 'setContent', 'setSpinner']);
    instance.present.and.returnValue(Promise.resolve());

    return instance;
  }
}

export class LoadingControllerMock {
  public static instance(loading?: LoadingMock): any {

    const instance = jasmine.createSpyObj('LoadingController', ['create']);
    instance.create.and.returnValue(loading || LoadingMock.instance());

    return instance;
  }
}

export class ModalControllerMock {
  constructor() {
    return new ModalController(null, null, null);
  }
}

export class NavParamsMock {
  static returnParam = null;

  public get(key): any {
    if (NavParamsMock.returnParam) {
      return NavParamsMock.returnParam;
    }
    return 'default';
  }

  // tslint:disable-next-line:member-ordering
  static setParams(value) {
    NavParamsMock.returnParam = value;
  }

}

export class MockExpiry extends IdleExpiry {
  public lastDate: Date;
  public mockNow: Date;

  last(value?: Date): Date {
    if (value !== void 0) {
      this.lastDate = value;
    }

    return this.lastDate;
  }

  now(): Date {
    return this.mockNow || new Date();
  }
}

export class IonicAppMock { }

export class NetworkInterfaceMock {

  getWiFiIPAddress(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Llamamos a resolve(...) cuando lo que estabamos haciendo finaliza con éxito, y reject(...) cuando falla.
      // En este ejemplo, usamos setTimeout(...) para simular código asíncrono.
      // En la vida real, probablemente uses algo como XHR o una API HTML5.
      setTimeout(function () {
        resolve({ 'ip': '127.0.0.1' }); // ¡Todo salió bien!
      }, 50);
    });
  }
}

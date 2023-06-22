import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

// Angular Testing ecosystem
import {getTestBed, TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';

import {FormsModule} from '@angular/forms';

import {
  App,
  Config,
  Form,
  IonicModule,
  Keyboard,
  DomController,
  MenuController,
  NavController,
  NavParams,
  Platform,
  GestureController,
  ViewController,
  Events
} from 'ionic-angular';
import {ConfigMock, NavParamsMock, ViewControllerMock, EventsMock} from 'ionic-mocks';

import {PlatformMock, StatusBarMock, SplashScreenMock} from 'mocks-ionic';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpClient, HttpClientModule} from '@angular/common/http';


// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare let __karma__: any;
declare let require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function (): void {
  // noop
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then we find all the tests.
const context: any = require.context('./', true, /\.spec\.ts$/);

// And load the modules.
context.keys().map(context);

// Finally, start Karma to run the tests.
__karma__.start();


export class TestUtils {

  public static beforeEachCompiler(components: Array<any>): Promise<{ fixture: any, instance: any }> {
    return TestUtils.configureIonicTestingModule(components)
      .compileComponents().then(() => {
        const fixture: any = TestBed.createComponent(components[0]);
        return {
          fixture,
          instance: fixture.debugElement.componentInstance
        };
      });
  }

  public static beforeEachCompilerProv(providers: Array<any>): Promise<{ fixture: any, instance: any }> {
    return TestUtils.configureIonicTestingModuleProv(providers)
      .compileComponents();
  }

  public static configureIonicTestingModule(components: Array<any>): typeof TestBed {
    return TestBed.configureTestingModule({
      declarations: [
        ...components
      ],
      providers: [
        App, Form, Keyboard, DomController, MenuController, NavController, GestureController,
        {provide: Config, useFactory: () => ConfigMock.instance()},
        {provide: NavParams, useFactory: () => NavParamsMock.instance()},
        {provide: StatusBar, useClass: StatusBarMock},
        {provide: SplashScreen, useClass: SplashScreenMock},
        {provide: Platform, useClass: PlatformMock},
        {provide: ViewController, useClass: ViewControllerMock},
        {provide: Events, useClass: EventsMock}
      ],
      imports: [
        FormsModule,
        IonicModule
      ]
    });
  }

  public static configureIonicTestingModuleProv(providers: Array<any>): typeof TestBed {
    return TestBed.configureTestingModule({

      providers: [
        App, Form, Keyboard, DomController, MenuController, NavController, GestureController,
        {provide: Config, useFactory: () => ConfigMock.instance()},
        {provide: NavParams, useFactory: () => NavParamsMock.instance()},
        {provide: StatusBar, useClass: StatusBarMock},
        {provide: SplashScreen, useClass: SplashScreenMock},
        {provide: Platform, useClass: PlatformMock},
        ...providers
      ],
      imports: [
        FormsModule,
        IonicModule,
        HttpClientModule
      ]
    });
  }

  // http://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
  public static eventFire(el: any, etype: string): void {
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      const evObj: any = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }
}

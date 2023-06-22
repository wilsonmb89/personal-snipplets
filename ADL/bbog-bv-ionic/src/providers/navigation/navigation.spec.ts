import { NavigationProvider } from './navigation';
import {} from 'jasmine';
import { TestBed } from '@angular/core/testing';
import { BdbPlatformsProvider } from '../bdb-platforms/bdb-platforms';
import { Platform, ModalController, Events } from 'ionic-angular';
import { ModalControllerMock } from '../../../test-config/mocks-ionic';
import { BdbFingerPrintProvider } from '../bdb-finger-print/bdb-finger-print';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { BdbCryptoProvider } from '../bdb-crypto/bdb-crypto';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { HttpClient } from '@angular/common/http';

describe('navigation provider: test', () => {
  let navigation: NavigationProvider;
  let navCtrlSpy;
  let bdbPlatformsSpy;
  let bdbFingerPrintSpy;
  let bdbInMemorySpy;

  beforeEach(() => {
    navCtrlSpy = jasmine.createSpyObj('NavController', ['setRoot']);
    bdbPlatformsSpy = jasmine.createSpyObj('BdbPlatformsProvider', ['isBrowser']);
    bdbFingerPrintSpy = jasmine.createSpyObj('BdbFingerPrintProvider', ['validateDeviceId']);
    bdbInMemorySpy = jasmine.createSpyObj('BdbInMemoryProvider', ['getItemByKey']);
  });

  afterEach(() => {
    navCtrlSpy = null;
    bdbPlatformsSpy = null;
    bdbFingerPrintSpy = null;
    bdbInMemorySpy = null;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationProvider,
        {
          provide: BdbPlatformsProvider,
          useValue: bdbPlatformsSpy
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock
        },
        BdbFingerPrintProvider,
        BdbInMemoryProvider,
        BdbCryptoProvider,
        Platform,
        BdbHttpClient,
        HttpClient
      ],
    }).compileComponents();
    navigation = TestBed.get(NavigationProvider);
  });

});

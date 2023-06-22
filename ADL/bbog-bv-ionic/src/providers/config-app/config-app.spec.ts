import { } from 'jasmine';
import { ConfigAppProvider } from './config-app';
import { TestBed } from '@angular/core/testing';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { BdbPlatformsProvider } from '../bdb-platforms/bdb-platforms';
import { Platform } from 'ionic-angular';
import { BdbInMemoryIonicProvider } from '../bdb-in-memory-ionic/bdb-in-memory-ionic';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Device } from '@ionic-native/device';
import { NetworkInterface } from '@ionic-native/network-interface';
import { BdbCryptoProvider } from '../bdb-crypto/bdb-crypto';
import { IonicStorageModule } from '@ionic/storage';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BdbHttpClient } from 'providers/bdb-http-client/bdb-http-client';
import { GlobalVariablesProvider } from 'providers/global-variables/global-variables';
import { SessionProvider } from 'providers/authenticator/session';
import { Events } from 'ionic-angular';
import { EventMapperProvider } from 'providers/funnel-events/events-mapper';
import { BdbUtilsProvider } from 'providers/bdb-utils/bdb-utils';
import { BdbRsaProvider } from 'providers/bdb-rsa/bdb-rsa';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { BdbMaskProvider } from 'providers/bdb-mask';
import { CustomCurrencyPipe } from 'pipes/custom-currency';
import { BdbCryptoForgeProvider } from 'providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from 'providers/bdb-hash-base/bdb-hash-base';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';

describe('provider: ConfigApp', () => {
    let configApp: ConfigAppProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ConfigAppProvider,
                BdbInMemoryProvider,
                BdbPlatformsProvider,
                Platform,
                BdbInMemoryIonicProvider,
                FingerprintAIO,
                Device,
                NetworkInterface,
                BdbCryptoProvider,
                BdbCryptoForgeProvider,
                BdbHashBaseProvider,
                HttpClient,
                HttpHandler,
                [{ provide: BdbHttpClient, useValue: jasmine.createSpyObj('BdbHttpClient', ['post']) }],
                GlobalVariablesProvider,
                 [{ provide: SessionProvider, useValue: jasmine.createSpyObj('SessionProvider', ['logout']) }],
                Events,
                EventMapperProvider,
                BdbUtilsProvider,
                BdbRsaProvider,
                BdbMaskProvider,
                DatePipe,
                CurrencyPipe,
                CustomCurrencyPipe,
                ClearStateFacade
            ],
            imports: [
                IonicStorageModule.forRoot(),
                StoreModule.forRoot({}),
                EffectsModule.forRoot([])
            ]
        }).compileComponents();
        configApp = TestBed.get(ConfigAppProvider);
    });

    it('should return data storage app', () => {
        configApp.dataStorageAction().then(
            (data) => {
                expect(data).not.toBeNull();
            }
        ).catch(
            (err) => console.log('error')
        );
    });


    it('should return data storage browser', () => {
        const bdbPlatforms: BdbPlatformsProvider = TestBed.get(BdbPlatformsProvider);
        spyOn(bdbPlatforms, 'isApp').and.returnValue(false);
        configApp.dataStorageAction().then(
            (data) => {
                expect(data).not.toBeNull();
            }
        ).catch(
            (err) => console.log('error')
        );
    });

    xit('should set app Ip', () => {
        const bdbInMemory: BdbInMemoryProvider = TestBed.get(BdbInMemoryProvider);
        const ip = bdbInMemory.getItemByKey(InMemoryKeys.IP);
        expect(ip).not.toBeNull();
    });

});

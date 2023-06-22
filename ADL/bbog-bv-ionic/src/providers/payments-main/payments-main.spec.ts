import { } from 'jasmine';
import { TestBed } from '@angular/core/testing';
import { PaymentsMainProvider } from './payments-main';
import { NavController, ModalController, Events, Platform } from 'ionic-angular';
import { NavControllerMock, ModalControllerMock, EventsMock, StorageMock, PlatformMock } from 'ionic-mocks';
import { BdbInMemoryProvider } from 'providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbCryptoProvider } from 'providers/bdb-crypto/bdb-crypto';
import { BdbHttpClient } from 'providers/bdb-http-client/bdb-http-client';
import { BdbUtilsProvider } from 'providers/bdb-utils/bdb-utils';
import { BdbModalProvider } from 'providers/bdb-modal/bdb-modal';
import { BdbRsaProvider } from 'providers/bdb-rsa/bdb-rsa';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GlobalVariablesProvider } from 'providers/global-variables/global-variables';
import { SessionProvider } from 'providers/authenticator/session';
import { BdbInMemoryIonicProvider } from 'providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { Storage } from '@ionic/storage';
import { EventMapperProvider } from 'providers/funnel-events/events-mapper';
import { BdbMaskProvider } from 'providers/bdb-mask';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { BdbPlatformsProvider } from 'providers/bdb-platforms/bdb-platforms';
import { AccessDetailProvider } from 'providers/access-detail/access-detail';
import { ProgressBarProvider } from 'providers/progress-bar/progress-bar';
import { CustomCurrencyPipe } from 'pipes/custom-currency';
import { BdbCookies } from '../../providers/bdb-cookie/bdb-cookie';
import { BdbCryptoForgeProvider } from '../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../../providers/bdb-hash-base/bdb-hash-base';


describe('payments main test suit', () => {
    let paymentsMain: PaymentsMainProvider;
    let navCtrl: NavController;

    beforeAll(() => {
        TestBed.configureTestingModule({
            providers: [
                PaymentsMainProvider,
                {
                    provide: NavController,
                    useClass: NavControllerMock
                },
                BdbInMemoryProvider,
                BdbCryptoProvider,
                BdbCryptoForgeProvider,
                BdbHashBaseProvider,
                BdbHttpClient,
                BdbUtilsProvider,
                {
                    provide: ModalController,
                    useClass: ModalControllerMock
                },
                BdbModalProvider,
                BdbRsaProvider,
                GlobalVariablesProvider,
                SessionProvider,
                {
                    provide: Events,
                    useClass: EventsMock
                },
                {
                    provide: Storage,
                    useClass: StorageMock
                },
                BdbInMemoryIonicProvider,
                EventMapperProvider,
                BdbMaskProvider,
                DatePipe,
                CurrencyPipe,
                CustomCurrencyPipe,
                {
                    provide: Platform,
                    useClass: PlatformMock
                },
                BdbPlatformsProvider,
                AccessDetailProvider,
                ProgressBarProvider,
                BdbCookies
            ],
            imports: [
                HttpClientTestingModule
            ]
        }).compileComponents();
        paymentsMain = TestBed.get(PaymentsMainProvider);
        navCtrl = TestBed.get(NavController);
    });

});

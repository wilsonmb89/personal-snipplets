import { } from 'jasmine';
import { AccountOpsProvider } from './account-ops';
import { TestBed } from '@angular/core/testing';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { EnrollProvider } from '../enroll/enroll';
import { mockApp } from 'ionic-angular/util/mock-providers';
import {App, LoadingController, Events, ModalController, Platform, AlertController, ToastController, Config} from 'ionic-angular';
import { PaymentsProvider } from '../payments/payments';
import { BdbModalProvider } from '../bdb-modal/bdb-modal';
import { TransactionsProvider } from '../transactions/transactions';
import { TsErrorProvider } from '../ts-error/ts-error-provider';
import { NavigationProvider } from '../navigation/navigation';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AcctEnrollRq } from 'app/models/transfers/acct-enroll-rq';
import { GlobalVariablesProvider } from '../global-variables/global-variables';
import { SessionProvider } from '../authenticator/session';
import { BdbCryptoProvider } from '../bdb-crypto/bdb-crypto';
import { LoadingControllerMock, ModalControllerMock, AlertControllerMock, StorageMock } from 'ionic-mocks';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { BdbPlatformsProvider } from '../bdb-platforms/bdb-platforms';
import { PlatformMock } from 'mocks-ionic';
import { AccessDetailProvider } from '../access-detail/access-detail';
import { ProgressBarProvider } from '../progress-bar/progress-bar';
import { BillOpsProvider } from '../bill-ops/bill-ops';
import { FilterUtilsProvider } from '../filter-utils/filter-utils';
import { TabsProvider } from '../tabs/tabs';
import { ProductsBalancesProvider } from '../products-balances/products-balances';
import { FunnelKeysProvider } from '../funnel-keys/funnel-keys';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { AvalOpsProvider } from '../aval-ops/aval-ops';
import { BdbInMemoryIonicProvider } from 'providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { Storage } from '@ionic/storage';
import { EventMapperProvider } from 'providers/funnel-events/events-mapper';
import { TimeoutProvider } from 'providers/timeout/timeout';
import { CustomCurrencyPipe } from 'pipes/custom-currency';
import { BdbCookies } from '../../providers/bdb-cookie/bdb-cookie';
import { BdbCryptoForgeProvider } from '../bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../bdb-hash-base/bdb-hash-base';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import {TransferCoreService} from '../../new-app/core/services-apis/transfer/transfer-core/transfer-core.service';
import {HttpClientWrapperProvider} from '../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';
import {BdbStorageService} from '../../new-app/shared/utils/bdb-storage-service/bdb-storage.service';
import {BdbCypherService} from '../../new-app/shared/utils/bdb-cypher-service/bdb-cypher.service';
import {PaymentsModule} from '../../new-app/modules/payments/payments.module';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';
import {BdbToastProvider} from '../bdb-toast/bdb-toast';

describe('provider: AccountOps', () => {
    let accountOps: AccountOpsProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccountOpsProvider,
                BdbHttpClient,
                BdbUtilsProvider,
                BdbInMemoryProvider,
                BdbRsaProvider,
                EnrollProvider,
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: ModalController, useClass: ModalControllerMock },
                { provide: AlertController, useClass: AlertControllerMock },
                { provide: App, useValue: mockApp() },
                PaymentsProvider,
                BdbModalProvider,
                TransactionsProvider,
                TsErrorProvider,
                NavigationProvider,
                GlobalVariablesProvider,
                SessionProvider,
                Events,
                BdbCryptoProvider,
                BdbMaskProvider,
                BdbPlatformsProvider,
                { provide: Platform, useClass: PlatformMock },
                AccessDetailProvider,
                ProgressBarProvider,
                BillOpsProvider,
                FilterUtilsProvider,
                TabsProvider,
                ProductsBalancesProvider,
                FunnelKeysProvider,
                DatePipe,
                CurrencyPipe,
                CustomCurrencyPipe,
                AvalOpsProvider,
                BdbInMemoryIonicProvider,
                {provide: Storage, useClass: StorageMock},
                EventMapperProvider,
                TimeoutProvider,
                BdbCookies,
                BdbCryptoForgeProvider,
                BdbHashBaseProvider,
                ClearStateFacade,
                TransferCoreService,
                HttpClientWrapperProvider,
                BdbStorageService,
                BdbCypherService,
                UserFacade,
                BdbToastProvider,
                ToastController,
                Config
            ],
            imports: [
                HttpClientTestingModule,
                StoreModule.forRoot({}),
                EffectsModule.forRoot([]),
                PaymentsModule
            ]
        });
        accountOps = TestBed.get(AccountOpsProvider);
    });

    it('should post request', () => {
        const mock: AcctEnrollRq = new AcctEnrollRq();
        const bdbHttp: BdbHttpClient = TestBed.get(BdbHttpClient);
        spyOn(bdbHttp, 'post');
        accountOps.enroll(mock);
        expect(bdbHttp.post).toHaveBeenCalled();
    });
});

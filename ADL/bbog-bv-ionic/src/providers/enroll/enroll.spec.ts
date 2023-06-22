import { EnrollProvider } from './enroll';
import { PaymentsProvider } from '../payments/payments';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { BdbModalProvider } from '../bdb-modal/bdb-modal';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { TransactionsProvider } from '../transactions/transactions';
import { TestBed } from '@angular/core/testing';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { LoadingController, ModalController, Events, Platform, App, IonicModule, Config, AlertController } from 'ionic-angular';
import { LoadingControllerMock, ModalControllerMock } from '../../../test-config/mocks-ionic';
import { } from 'jasmine';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { BdbCryptoProvider } from '../bdb-crypto/bdb-crypto';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GlobalVariablesProvider } from '../global-variables/global-variables';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { MockProductsProvider } from '../products/products.mock';
import { SessionProvider } from '../authenticator/session';
import { BillOpsProvider } from '../bill-ops/bill-ops';
import { BdbPlatformsProvider } from '../bdb-platforms/bdb-platforms';
import { AccessDetailProvider } from '../access-detail/access-detail';
import { ProgressBarProvider } from '../progress-bar/progress-bar';
import { NavigationProvider } from '../navigation/navigation';
import { TsErrorProvider } from '../ts-error/ts-error-provider';
import { FilterUtilsProvider } from '../filter-utils/filter-utils';
import { TabsProvider } from '../tabs/tabs';
import { mockApp } from 'ionic-angular/util/mock-providers';
import { ProductsBalancesProvider } from '../products-balances/products-balances';
import { AlertControllerMock, StorageMock } from 'ionic-mocks';
import { FunnelEventsProvider } from '../funnel-events/funnel-events';
import { FunnelKeysProvider } from '../funnel-keys/funnel-keys';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { AvalOpsProvider } from '../aval-ops/aval-ops';
import { BdbInMemoryIonicProvider } from '../../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { Storage } from '@ionic/storage';
import { CustomCurrencyPipe } from 'pipes/custom-currency';

describe('enroll provider test suite', () => {
    let enroll: EnrollProvider;
    let bdbInMemory: BdbInMemoryProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EnrollProvider,
                PaymentsProvider,
                BdbUtilsProvider,
                BdbModalProvider,
                BdbInMemoryProvider,
                TransactionsProvider,
                BdbMaskProvider,
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: ModalController, useClass: ModalControllerMock },
                { provide: AlertController, useClass: AlertControllerMock },
                BdbRsaProvider,
                BdbCryptoProvider,
                BdbHttpClient,
                GlobalVariablesProvider,
                SessionProvider,
                Events,
                BdbPlatformsProvider,
                Platform,
                AccessDetailProvider,
                ProgressBarProvider,
                NavigationProvider,
                TsErrorProvider,
                { provide: App, useValue: mockApp() },
                Config,
                BillOpsProvider,
                FilterUtilsProvider,
                TabsProvider,
                ProductsBalancesProvider,
                FunnelEventsProvider,
                FunnelKeysProvider,
                DatePipe,
                CurrencyPipe,
                CustomCurrencyPipe,
                AvalOpsProvider,
                BdbInMemoryIonicProvider,
                {provide: Storage, useClass: StorageMock}
            ],
            imports: [
                HttpClientTestingModule,
            ]
        }).compileComponents();
        enroll = TestBed.get(EnrollProvider);
        bdbInMemory = TestBed.get(BdbInMemoryProvider);
    });

    beforeEach(() => {
        bdbInMemory.setItemByKey(InMemoryKeys.CustomerProductList, MockProductsProvider.getProductsMock());
    });

});

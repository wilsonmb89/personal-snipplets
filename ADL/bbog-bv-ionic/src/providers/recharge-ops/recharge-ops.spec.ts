import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';
import { BdbConstants } from 'app/models/bdb-generics/bdb-constants';
import { BdbMap } from 'app/models/bdb-generics/bdb-map';
import { RechargeInfo } from 'app/models/recharges/recharge-info';
import { Events, Platform } from 'ionic-angular';
import { StorageMock } from 'ionic-mocks';
import { } from 'jasmine';
import { EventMapperProvider } from 'providers/funnel-events/events-mapper';
import { FunnelEventsProvider } from 'providers/funnel-events/funnel-events';
import { BdbInMemoryIonicProvider } from '../../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { TimeoutProvider } from '../../providers/timeout/timeout';
import { SessionProvider } from '../authenticator/session';
import { BdbCryptoProvider } from '../bdb-crypto/bdb-crypto';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { GlobalVariablesProvider } from '../global-variables/global-variables';
import { MockProductsProvider } from '../products/products.mock';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { RechargeOpsProvider } from './recharge-ops';
import { CustomCurrencyPipe } from 'pipes/custom-currency';
import { BdbCryptoForgeProvider } from '../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../../providers/bdb-hash-base/bdb-hash-base';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

describe('provider: RechargeOps', () => {
    let rechargeOps: RechargeOpsProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RechargeOpsProvider,
                [{ provide: BdbHttpClient, useValue: jasmine.createSpyObj('BdbHttpClient', ['post']) }],
                BdbUtilsProvider,
                BdbInMemoryProvider,
                BdbRsaProvider,
                BdbMaskProvider,
                BdbCryptoProvider,
                BdbCryptoForgeProvider,
                BdbHashBaseProvider,
                GlobalVariablesProvider,
                 [{ provide: SessionProvider, useValue: jasmine.createSpyObj('SessionProvider', ['logout']) }],
                Events,
                DatePipe,
                CurrencyPipe,
                CustomCurrencyPipe,
                BdbInMemoryIonicProvider,
                { provide: Storage, useClass: StorageMock },
                EventMapperProvider,
                FunnelEventsProvider,
                Platform,
                TimeoutProvider,
                ClearStateFacade
            ],
            imports: [
                HttpClientTestingModule,
                StoreModule.forRoot({}),
                EffectsModule.forRoot([])
            ]
        });
        rechargeOps = TestBed.get(RechargeOpsProvider);
    });

    it('should return recharge rq', () => {
        const mock: RechargeInfo = getRechargeInfo();
        expect(rechargeOps.buildRq(mock)).not.toBeNull();
    });

    function getRechargeInfo() {
        const carrier: BdbMap = {
            key: 'cl',
            value: 'claro'
        };
        const mock: RechargeInfo = new RechargeInfo();
        mock.account = MockProductsProvider.payment;
        mock.amount = '2000';
        mock.carrier = carrier;
        mock.phoneNumber = '3123245467';
        mock.transactionCost = BdbConstants.TRANSACTION_COST.NO_COST;
        return mock;
    }
});

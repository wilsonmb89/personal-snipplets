import { PaymentsProvider } from './payments';
import {} from 'jasmine';
import { TestBed } from '@angular/core/testing';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { TransactionsProvider } from '../transactions/transactions';
import {LoadingController, Loading, ModalController, Events} from 'ionic-angular';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GlobalVariablesProvider } from '../global-variables/global-variables';
import { LoadingControllerMock, ModalControllerMock} from '../../../test-config/mocks-ionic';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import {BdbCryptoProvider} from '../bdb-crypto/bdb-crypto';
import { SessionProvider } from '../authenticator/session';

describe('payments provider test suite', () => {

    let payments: PaymentsProvider;
    let transactions: TransactionsProvider;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                PaymentsProvider,
                BdbRsaProvider,
                BdbInMemoryProvider,
                BdbCryptoProvider,
                BdbMaskProvider,
                TransactionsProvider,
                BdbHttpClient,
                GlobalVariablesProvider,
                SessionProvider,
                Events,
                BdbUtilsProvider,
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: ModalController, useClass: ModalControllerMock}
            ],
            imports: [
                HttpClientTestingModule
            ]
        }).compileComponents();

        payments = TestBed.get(PaymentsProvider);
        transactions = TestBed.get(TransactionsProvider);
    });
});

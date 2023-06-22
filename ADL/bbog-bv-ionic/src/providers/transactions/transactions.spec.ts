import { TransactionsProvider } from './transactions';
import { } from 'jasmine';
import { TestBed } from '@angular/core/testing';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GlobalVariablesProvider } from '../global-variables/global-variables';
import { ModalControllerMock } from '../../../test-config/mocks-ionic';
import { ModalController, Events } from 'ionic-angular';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { SessionProvider } from '../authenticator/session';
import { BdbCryptoProvider } from '../bdb-crypto/bdb-crypto';
import { BdbModalProvider } from '../bdb-modal/bdb-modal';
import { NavigationProvider } from '../navigation/navigation';
import { TsErrorProvider } from '../ts-error/ts-error-provider';
import {PaymentsModule} from '../../new-app/modules/payments/payments.module';

describe('transactions provider test suite', () => {

    let transactions: TransactionsProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TransactionsProvider,
                BdbHttpClient,
                SessionProvider,
                BdbCryptoProvider,
                GlobalVariablesProvider,
                Events,
                { provide: ModalController, useClass: ModalControllerMock },
                BdbInMemoryProvider,
                BdbModalProvider,
                NavigationProvider,
                TsErrorProvider
            ],
            imports: [
                HttpClientTestingModule,
                PaymentsModule
            ]
        });
        transactions = TestBed.get(TransactionsProvider);
    });
});

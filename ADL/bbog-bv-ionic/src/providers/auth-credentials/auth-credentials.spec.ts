import { AuthCredentialsProvider } from './auth-credentials';
import {} from 'jasmine';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import {BdbCryptoProvider} from '../bdb-crypto/bdb-crypto';
import { AuthenticatorProvider } from '../authenticator/authenticator';
import { AuthenticatorProviderMock } from '../authenticator/authenticator.mock';
import { BdbCryptoForgeProvider } from '../bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../bdb-hash-base/bdb-hash-base';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

describe('auth credentials test suite', () => {
    let authCredentials: AuthCredentialsProvider;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                AuthCredentialsProvider,
                BdbInMemoryProvider,
                BdbCryptoProvider,
                BdbCryptoForgeProvider,
                BdbHashBaseProvider,
                { provide: AuthenticatorProvider, useClass: AuthenticatorProviderMock},
                ClearStateFacade
            ],
            imports: [
                HttpClientTestingModule,
                StoreModule.forRoot({}),
                EffectsModule.forRoot([])
            ]
        });

        authCredentials = TestBed.get(AuthCredentialsProvider);
    });

    it('should make an http call', () => {
        const url = authCredentials.getCredentialsAuth('123456');
        expect(url).toBeTruthy();
    });
});

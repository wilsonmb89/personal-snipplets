import { AuthListenerProvider } from './auth-listener';
import { } from 'jasmine';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { GlobalVariablesProvider } from '../global-variables/global-variables';
import { BdbCryptoForgeProvider } from '../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../../providers/bdb-hash-base/bdb-hash-base';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StorageMock } from 'ionic-mocks';
import { EffectsModule } from '@ngrx/effects';

describe('auth listener provider test suit', () => {

    let authListener: AuthListenerProvider;
    let bdbCryptoForge: BdbCryptoForgeProvider;
    let bdbHashBase: BdbHashBaseProvider;
    let clearStateFacade: ClearStateFacade;
    let store: Store<any>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                BdbInMemoryProvider,
                { provide: Storage, useClass: StorageMock },
                BdbCryptoForgeProvider,
                BdbHashBaseProvider,
                ClearStateFacade
            ],
            imports: [
                StoreModule.forRoot({}),
                EffectsModule.forRoot([])
            ]
        });

        store = TestBed.get(Store);
        clearStateFacade = new ClearStateFacade(store);
        bdbHashBase = new BdbHashBaseProvider();
        bdbCryptoForge = new BdbCryptoForgeProvider(bdbHashBase);
        authListener = new AuthListenerProvider(new BdbInMemoryProvider(bdbCryptoForge, clearStateFacade), new GlobalVariablesProvider());
    });

    it('should delete local storage', () => {
        authListener.logout();
        expect(localStorage.length).toEqual(0);
    });

    it('should return auth url', () => {
        expect(authListener.getAuthenticationUrl()).toBeTruthy();
    });
});

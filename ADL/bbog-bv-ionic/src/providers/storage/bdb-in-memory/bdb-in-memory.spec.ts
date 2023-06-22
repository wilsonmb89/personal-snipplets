import { BdbInMemoryProvider } from './bdb-in-memory';
import { } from 'jasmine';
import { InMemoryKeys } from '../in-memory.keys';
import { BdbCryptoForgeProvider } from '../../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../../../providers/bdb-hash-base/bdb-hash-base';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { StorageMock } from 'ionic-mocks';
import { EffectsModule } from '@ngrx/effects';

describe('bdb in memory test suit', () => {
    let bdbInMemory: BdbInMemoryProvider;
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
        bdbInMemory = new BdbInMemoryProvider(new BdbCryptoForgeProvider(new BdbHashBaseProvider()), clearStateFacade);
        bdbInMemory.setItemByKey(InMemoryKeys.PaymentOrigin, 'recharge');
    });

    afterEach(() => {
        bdbInMemory.clearAll();
    });

    it('should get data in session storage', () => {
        expect(bdbInMemory.getItemByKey(InMemoryKeys.PaymentOrigin)).toEqual('recharge');
    });

    it('should clear item by key', () => {
        bdbInMemory.clearItem(InMemoryKeys.PaymentOrigin);
        expect(bdbInMemory.getItemByKey(InMemoryKeys.PaymentOrigin)).toBe(null);
    });

    it('should clear all data', () => {
        bdbInMemory.clearAll();
        expect(localStorage.length).toBe(0);
        expect(sessionStorage.length).toBe(4);
    });

    it('should save data in session storage', () => {
        bdbInMemory.setItemByKey(InMemoryKeys.PaymentOrigin, '1239191123');
        expect(bdbInMemory.getItemByKey(InMemoryKeys.PaymentOrigin)).toEqual('1239191123');
    });

    it('should return all data in session storage', () => {
        expect(bdbInMemory.getAll()).toBe(sessionStorage);
    });
});

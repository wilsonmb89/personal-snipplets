import { BdbUtilsProvider } from './bdb-utils';
import { } from 'jasmine';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { Customer } from '../../app/models/bdb-generics/customer';
import { IdType } from './id-type.enum';
import { EncryptionIdType } from './encryption-id.enum';
import { BdbHashBaseProvider } from '../../providers/bdb-hash-base/bdb-hash-base';
import { BdbCryptoForgeProvider } from '../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { StorageMock } from 'ionic-mocks';
import { EffectsModule } from '@ngrx/effects';
import {App} from 'ionic-angular';
import {Config} from 'ionic-angular/config/config';
import {Platform} from 'ionic-angular/platform/platform';

describe('BdbUtilsProvider', () => {
    let bdbUtils: BdbUtilsProvider;
    let bdbInMemory: BdbInMemoryProvider;
    let bdbRsa: BdbRsaProvider;
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
        bdbRsa = new BdbRsaProvider();
        bdbInMemory = new BdbInMemoryProvider(new BdbCryptoForgeProvider(new BdbHashBaseProvider()), clearStateFacade);
        bdbUtils = new BdbUtilsProvider(bdbInMemory, bdbRsa);
    });

    it('should return a color by key', () => {
        expect(bdbUtils.getRandomColor(0)).toBe('#f89b1b');
    });

    it('should re start the counter when index greater than array', () => {
        expect(bdbUtils.getRandomColor(8)).toBe('#ee7a21');
    });

    it('should return a fully encrypted user', () => {
        setItems();
        const c: Customer = new Customer(bdbRsa.encrypt('123456'), bdbRsa.encrypt('C'));
        expect(bdbUtils.getCustomer(IdType.BUS_BDB, EncryptionIdType.FULL)).toEqual(c);
    });

    it('should return a partially encrypted user', () => {
        setItems();
        const c: Customer = new Customer(bdbRsa.encrypt('123456'), 'C');
        expect(bdbUtils.getCustomer()).toEqual(c);
    });

    it('should add 0s to left', () => {
        const nura = bdbUtils.pad('1234', 8);
        expect(nura).toBe('00001234');
    });

    function setItems() {
        bdbInMemory.setItemByKey(InMemoryKeys.IdentificationNumber, '123456');
        bdbInMemory.setItemByKey(InMemoryKeys.IdentificationType, 'C');
    }
});

import { } from 'jasmine';
import { TestBed } from '@angular/core/testing';
import { ProgressBarProvider } from 'providers/progress-bar/progress-bar';
import { BdbMaskProvider } from 'providers/bdb-mask';
import { BdbInMemoryProvider } from 'providers/storage/bdb-in-memory/bdb-in-memory';
import { AccessDetailProvider } from './access-detail';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { BdbCryptoProvider } from 'providers/bdb-crypto/bdb-crypto';
import { MockProductsProvider } from 'providers/products/products.mock';
import { CustomCurrencyPipe } from 'pipes/custom-currency';
import { BdbCryptoForgeProvider } from '../bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../bdb-hash-base/bdb-hash-base';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

describe('AccessDetailProvider test suite', () => {

    let accessDetailProvider: AccessDetailProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccessDetailProvider,
                ProgressBarProvider,
                BdbMaskProvider,
                BdbInMemoryProvider,
                DatePipe,
                CurrencyPipe,
                CustomCurrencyPipe,
                BdbCryptoProvider,
                BdbCryptoForgeProvider,
                BdbHashBaseProvider,
                ClearStateFacade
            ],
            imports: [
                StoreModule.forRoot({}),
                EffectsModule.forRoot([])
            ]
        });
        accessDetailProvider = TestBed.get(AccessDetailProvider);
    });

    it('should return if an account was selected', () => {
        const isOriginSelected = accessDetailProvider.isOriginSelected();
        expect(isOriginSelected).toBeFalsy();
    });

    it('should select and account', () => {
        const p = MockProductsProvider.payment;
        accessDetailProvider.setOriginSelected(p);
        expect(accessDetailProvider.isOriginSelected).toBeTruthy();
    });

    it('should return a selected account', () => {
        const p = MockProductsProvider.payment;
        accessDetailProvider.setOriginSelected(p);
        const ps = accessDetailProvider.getOriginSelected();
        expect(ps).toEqual(p);
    });
});

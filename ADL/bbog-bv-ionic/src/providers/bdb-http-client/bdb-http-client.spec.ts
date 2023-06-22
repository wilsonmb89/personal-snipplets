import { BdbHttpClient } from './bdb-http-client';
import {  } from 'jasmine';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GlobalVariablesProvider } from '../global-variables/global-variables';
import { ProductDetail } from '../../app/models/products/product-model';
import { SessionProvider } from '../authenticator/session';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { BdbCryptoProvider } from '../bdb-crypto/bdb-crypto';
import { App, Events, Platform } from 'ionic-angular';
import { StorageMock } from 'ionic-mocks';
import { BdbInMemoryIonicProvider } from '../../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { Storage } from '@ionic/storage';
import { EventMapperProvider } from 'providers/funnel-events/events-mapper';
import { BdbUtilsProvider } from 'providers/bdb-utils/bdb-utils';
import { BdbRsaProvider } from 'providers/bdb-rsa/bdb-rsa';
import { BdbMaskProvider } from 'providers/bdb-mask';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { CustomCurrencyPipe } from 'pipes/custom-currency';
import { BdbCryptoForgeProvider } from '../bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../bdb-hash-base/bdb-hash-base';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

describe('testing bdb http client provider', () => {

    let bdbHttpClient: BdbHttpClient;
    let backend: HttpTestingController;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                GlobalVariablesProvider,
                SessionProvider,
                BdbHttpClient,
                BdbInMemoryProvider,
                BdbCryptoProvider,
                BdbCryptoForgeProvider,
                BdbHashBaseProvider,
                Events,
                BdbInMemoryIonicProvider,
                EventMapperProvider,
                BdbUtilsProvider,
                BdbRsaProvider,
                BdbMaskProvider,
                DatePipe,
                CurrencyPipe,
                CustomCurrencyPipe,
                Platform,
                {provide: Storage, useClass: StorageMock},
                ClearStateFacade,
                 [{ provide: App, useValue: jasmine.createSpyObj('App', ['getRootNav']) }],
            ],
            imports: [
                HttpClientTestingModule,
                StoreModule.forRoot({}),
                EffectsModule.forRoot([])
            ]
        });
        backend = TestBed.get(HttpTestingController);
        bdbHttpClient = TestBed.get(BdbHttpClient);
    });

    it('should return null with empty parameters', () => {
        bdbHttpClient.get('', '')
        .subscribe(data => {
            expect(data).toBeNull();
        });
    });

    it('should return products array', () => {

          const product: ProductDetail = {
            productName: 'Cuenta de Ahorros',
            productType: 'SDA',
            productNumber: '****1345',
            productNumberX: '0019501345',
            productBank: 'Banco de Bogotá',
            isAval: false,
            description: 'Disponible',
            amount: 1025584242,
            isActive: false,
            bankId: '00010016'
          };

          const mockResponse: Array<ProductDetail> = [
            product,
            product
        ];

        bdbHttpClient.get('products/balances', '')
        .subscribe(
            data => {
                expect(data).toBe(mockResponse);
            }
        );

        backend
          .expectOne('http://localhost:8666/products/balances')
          .flush(mockResponse);
    });
});

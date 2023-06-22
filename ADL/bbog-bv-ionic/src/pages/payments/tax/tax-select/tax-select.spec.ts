import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxSelectPage } from './tax-select';
import { IonicModule, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ComponentsModule } from '../../../../components/components.module';
import { TextMaskModule } from 'angular2-text-mask';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavMock } from 'mocks-ionic';
import { NavParamsMock, StorageMock } from 'ionic-mocks';
import { FormBuilder } from '@angular/forms';
import { NavigationProvider } from '../../../../providers/navigation/navigation';
import { MobileSummaryProvider } from 'components/mobile-summary';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { FunnelKeysProvider } from '../../../../providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from '../../../../providers/funnel-events/funnel-events';
import { ProgressBarProvider } from '../../../../providers/progress-bar/progress-bar';
import { BdbUtilsProvider } from '../../../../providers/bdb-utils/bdb-utils';
import { TransactionsProvider } from '../../../../providers/transactions/transactions';
import { BdbRsaProvider } from '../../../../providers/bdb-rsa/bdb-rsa';
import { BdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms';
import { MockBdbPlatformsProvider } from '../../../../providers/bdb-platforms/bdb-platforms.mock';
import { BdbCryptoProvider } from '../../../../providers/bdb-crypto/bdb-crypto';
import { BdbHttpClient } from '../../../../providers/bdb-http-client/bdb-http-client';
import { GlobalVariablesProvider } from '../../../../providers/global-variables/global-variables';
import { SessionProvider } from '../../../../providers/authenticator/session';
import { BdbMaskProvider } from '../../../../providers/bdb-mask/bdb-mask';
import { BdbModalProvider } from '../../../../providers/bdb-modal/bdb-modal';
import { AccessDetailProvider } from '../../../../providers/access-detail/access-detail';
import { TsErrorProvider } from '../../../../providers/ts-error/ts-error-provider';
import { TabsProvider } from '../../../../providers/tabs/tabs';
import { ProductsBalancesProvider } from '../../../../providers/products-balances/products-balances';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { AvalOpsProvider } from '../../../../providers/aval-ops/aval-ops';
import { BdbInMemoryIonicProvider } from '../../../../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { Storage } from '@ionic/storage';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventMapperProvider } from '../../../../providers/funnel-events/events-mapper';
import { TimeoutProvider } from '../../../../providers/timeout/timeout';
import { CustomCurrencyPipe } from 'pipes/custom-currency';
import { BdbCookies } from 'providers/bdb-cookie/bdb-cookie';
import { BdbCryptoForgeProvider } from '../../../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../../../../providers/bdb-hash-base/bdb-hash-base';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import {PaymentsModule} from '../../../../new-app/modules/payments/payments.module';
import {TransferCoreService} from '../../../../new-app/core/services-apis/transfer/transfer-core/transfer-core.service';
import {HttpClientWrapperProvider} from '../../../../new-app/core/http/http-client-wrapper/http-client-wrapper.service';
import {BdbStorageService} from '../../../../new-app/shared/utils/bdb-storage-service/bdb-storage.service';
import {BdbCypherService} from '../../../../new-app/shared/utils/bdb-cypher-service/bdb-cypher.service';
import {UserFacade} from '@app/shared/store/user/facades/user.facade';
import {BdbToastProvider} from '../../../../providers/bdb-toast/bdb-toast';
import { DistrictTaxDelegateService } from '../../../../new-app/core/services-delegate/payment-billers-delegate/district-tax-delegate';
import { PulseModalControllerProvider } from '../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { GenericModalService } from '@app/shared/components/modals/generic-modal/provider/generic-modal.service';

describe('TaxSelectPage', () => {

    let fixture: ComponentFixture<TaxSelectPage>;
    let component: TaxSelectPage;
    const formBuilder: FormBuilder = new FormBuilder();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaxSelectPage],
            imports: [
                IonicModule.forRoot(this),
                ComponentsModule,
                TextMaskModule,
                HttpClientTestingModule,
                StoreModule.forRoot({}),
                EffectsModule.forRoot([]),
                PaymentsModule
              ],
              schemas: [CUSTOM_ELEMENTS_SCHEMA],
              providers: [
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: BdbPlatformsProvider, useClass: MockBdbPlatformsProvider },
                FormBuilder,
                NavigationProvider,
                MobileSummaryProvider,
                BdbInMemoryProvider,
                FunnelKeysProvider,
                FunnelEventsProvider,
                ProgressBarProvider,
                BdbUtilsProvider,
                TransactionsProvider,
                LoadingController,
                BdbRsaProvider,
                BdbCryptoProvider,
                BdbHttpClient,
                GlobalVariablesProvider,
                SessionProvider,
                BdbMaskProvider,
                AccessDetailProvider,
                TsErrorProvider,
                BdbModalProvider,
                BdbRsaProvider,
                TabsProvider,
                ProductsBalancesProvider,
                DatePipe,
                CurrencyPipe,
                CustomCurrencyPipe,
                AvalOpsProvider,
                BdbInMemoryIonicProvider,
                {provide: Storage, useClass: StorageMock},
                FunnelEventsProvider,
                EventMapperProvider,
                BdbUtilsProvider,
                BdbRsaProvider,
                TimeoutProvider,
                BdbCookies,
                BdbCryptoForgeProvider,
                BdbHashBaseProvider,
                ClearStateFacade,
                TransferCoreService,
                HttpClientWrapperProvider,
                BdbStorageService,
                BdbCypherService,
                UserFacade,
                BdbToastProvider,
                PulseModalControllerProvider,
                GenericModalService,
                {
                  provide: DistrictTaxDelegateService,
                  useValue: jasmine.createSpyObj('DistrictTaxDelegateService', [
                    'getDistrictTaxCities',
                    'getDistrictTaxAgreements',
                    'getDistrictTax'
                  ]),
                },
              ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaxSelectPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.showMessage = false;
    });

    it('should create component', () => {
        expect(component).toBeDefined();
    });

    it('should return false tax element is not present', () => {
        component.formTax = formBuilder.group({
            city: '010',
            ref: '123'
        });
        component.validateMessage();
        expect(component.showMessage).toBe(false);
    });
});

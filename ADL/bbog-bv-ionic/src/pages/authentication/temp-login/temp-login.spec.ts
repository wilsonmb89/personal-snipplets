import { TempLoginPage } from './temp-login';
import { TestBed, async } from '@angular/core/testing';
import { MyApp } from '../../../app/app.component';
import {} from 'jasmine';
import { IonicModule, NavController, Platform, Events } from 'ionic-angular';
import { BdbInMemoryProvider } from '../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { FormBuilder } from '@angular/forms';
import { BdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms';
import { ProductsBalancesProvider } from '../../../providers/products-balances/products-balances';
import { NavMock, PlatformMock } from '../../../../test-config/mocks-ionic';
import { MockBdbPlatformsProvider } from '../../../providers/bdb-platforms/bdb-platforms.mock';
import { NavigationProvider } from '../../../providers/navigation/navigation';
import { FunnelEventsProvider } from '../../../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../../../providers/funnel-keys/funnel-keys';
import { BdbHttpClient } from '../../../providers/bdb-http-client/bdb-http-client';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GlobalVariablesProvider } from '../../../providers/global-variables/global-variables';
import { BdbCryptoProvider } from '../../../providers/bdb-crypto/bdb-crypto';
import { SessionProvider } from '../../../providers/authenticator/session';
import { BdbUtilsProvider } from '../../../providers/bdb-utils/bdb-utils';
import { BdbRsaProvider } from '../../../providers/bdb-rsa/bdb-rsa';
import { ComponentsModule } from '../../../components/components.module';
import { BdbFingerPrintProvider } from '../../../providers/bdb-finger-print/bdb-finger-print';
import { BdbInMemoryIonicProvider } from '../../../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EventMapperProvider } from '../../../providers/funnel-events/events-mapper';
import { BdbMaskProvider } from 'providers/bdb-mask';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { CustomCurrencyPipe } from 'pipes/custom-currency';
import { BdbCryptoForgeProvider } from '../../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../../../providers/bdb-hash-base/bdb-hash-base';
import { BdbSecuritySetupProvider } from '../../../providers/bdb-security/bdb-security-setup';
import { BdbSecurityRestProvider } from '../../../providers/bdb-security/bdb-security-rest';
import { BdbBankingReportsProvider } from '../../../providers/bdb-banking-reports/bdb-banking-reports';
import { BdbOtpProvider } from '../../../providers/bdb-otp-provider/bdb-otp-provider';
import { PulseModalControllerProvider } from '../../../providers/pulse-modal-controller/pulse-modal-controller';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TooltipInfoOpsProvider } from '../../../new-app/shared/utils/bdb-pulse-ops-services/tooltip-info-ops';

describe('temp login page testing', () => {
  let fixture;
  let component: TempLoginPage;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempLoginPage, MyApp],
      imports: [
        IonicModule.forRoot(MyApp),
        HttpClientTestingModule,
        ComponentsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useClass: NavMock },
        BdbInMemoryProvider,
        FormBuilder,
        { provide: BdbPlatformsProvider, useClass: MockBdbPlatformsProvider },
        ProductsBalancesProvider,
        { provide: Platform, useClass: PlatformMock },
        NavigationProvider,
        FunnelEventsProvider,
        FunnelKeysProvider,
        BdbCryptoProvider,
        BdbHttpClient,
        GlobalVariablesProvider,
        SessionProvider,
        Events,
        BdbUtilsProvider,
        BdbRsaProvider,
        BdbFingerPrintProvider,
        EventMapperProvider,
        BdbUtilsProvider,
        BdbRsaProvider,
        BdbMaskProvider,
        DatePipe,
        CurrencyPipe,
        CustomCurrencyPipe,
        { provide: BdbInMemoryIonicProvider, useClass: MockBdbPlatformsProvider },
        BdbCryptoForgeProvider,
        BdbHashBaseProvider,
        BdbSecuritySetupProvider,
        BdbSecurityRestProvider,
        BdbBankingReportsProvider,
        BdbOtpProvider,
        PulseModalControllerProvider,
        ClearStateFacade,
        TooltipInfoOpsProvider
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempLoginPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});

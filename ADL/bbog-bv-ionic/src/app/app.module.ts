import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../pipes/custom-currency';
/* angular modules */
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NetworkInterface } from '@ionic-native/network-interface';
import { SplashScreen } from '@ionic-native/splash-screen';
/* pages */
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { CrossSellProvider } from '../components/cross-sell';
import { MobileSummaryProvider } from '../components/mobile-summary';
import { SelectionAvalPage } from '../pages/products-aval/selection-aval/selection-aval';
import { SelectionAvalPageModule } from '../pages/products-aval/selection-aval/selection-aval.module';
import { AccessDetailProvider } from '../providers/access-detail/access-detail';
import { AccountOpsProvider } from '../providers/account-ops/account-ops';
import { ActivationCardsProvider } from '../providers/activation-cards/activation-cards';
import { AuthCredentialsProvider } from '../providers/auth-credentials/auth-credentials';
import { AuthListenerProvider } from '../providers/auth-listener/auth-listener';
import { AuthenticatorProvider } from '../providers/authenticator/authenticator';
import { PinProvider } from '../providers/authenticator/pin';
import { SessionProvider } from '../providers/authenticator/session';
import { AvalOpsProvider } from '../providers/aval-ops/aval-ops';
import { BalanceUtilsProvider } from '../providers/balance-utils/balance-utils';
import { BdbCookies } from '../providers/bdb-cookie/bdb-cookie';
import { BdbCryptoProvider } from '../providers/bdb-crypto/bdb-crypto';
import { BdbFavoritesProvider } from '../providers/bdb-favorites/bdb-favorites';
import { BdbFingerPrintProvider } from '../providers/bdb-finger-print/bdb-finger-print';
import { BdbHttpClient } from '../providers/bdb-http-client/bdb-http-client';
import { BdbInMemoryIonicProvider } from '../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { BdbMaskProvider } from '../providers/bdb-mask/bdb-mask';
import { BdbModalProvider } from '../providers/bdb-modal/bdb-modal';
import { BdbPdfProvider } from '../providers/bdb-pdf/bdb-pdf';
import { BdbPlatformsProvider } from '../providers/bdb-platforms/bdb-platforms';
import { BdbProductsProvider } from '../providers/bdb-products/bdb-products';
import { BdbRsaProvider } from '../providers/bdb-rsa/bdb-rsa';
import { BdbToastProvider } from '../providers/bdb-toast/bdb-toast';
import { BdbUtilsProvider } from '../providers/bdb-utils/bdb-utils';
import { BdbValidateAuthProvider } from '../providers/bdb-validate-auth/bdb-validate-auth';
import { BillOpsProvider } from '../providers/bill-ops/bill-ops';
import { CardSecurityProvider } from '../providers/card-security/card-security';
import { CardsMapperProvider } from '../providers/cards-mapper/cards-mapper';
import { CarriersRepoProvider } from '../providers/carriers-repo/carriers-repo';
import { ConfigAppProvider } from '../providers/config-app/config-app';
import { CreditCardPaymentProvider } from '../providers/credit-card-payment/credit-card-payment';
import { CreditPaymentProvider } from '../providers/credit-payment/credit-payment';
import { CustomerManagementProvider } from '../providers/customer-management/customer-management';
import { DebitCardLockProvider } from '../providers/debit-card-lock/debit-card-lock';
import { EnrollProvider } from '../providers/enroll/enroll';
import { EnrolledAccountOpsProvider } from '../providers/enrolled-account-ops/enrolled-account-ops';
import { FilterUtilsProvider } from '../providers/filter-utils/filter-utils';
import { FunnelEventsProvider } from '../providers/funnel-events/funnel-events';
import { FunnelKeysProvider } from '../providers/funnel-keys/funnel-keys';
import { GlobalVariablesProvider } from '../providers/global-variables/global-variables';
import { GoogleAnalyticsProvider } from '../providers/google-analytics/google-analytics';
import { HistoryTxProvider } from '../providers/history-tx/history-tx';
import { IdentificationTypeListProvider } from '../providers/identification-type-list-service/identification-type-list-service';
import { LimitsProvider } from '../providers/limits/limits';
import { EmailProvider } from '../providers/messenger';
import { NavigationProvider } from '../providers/navigation/navigation';
import { OnboardingHomeProvider } from '../providers/onboarding-home/onboarding-home';
import { PaymentsMainProvider } from '../providers/payments-main/payments-main';
import { PaymentsProvider } from '../providers/payments/payments';
import { PrivateModeProvider } from '../providers/private-mode/private-mode';
import { ProductsBalancesProvider } from '../providers/products-balances/products-balances';
import { ProgressBarProvider } from '../providers/progress-bar/progress-bar';
import { QuickAccessProvider } from '../providers/quick-access/quick-access';
import { RechargeOpsProvider } from '../providers/recharge-ops/recharge-ops';
import { SelectAccountHandlerProvider } from '../providers/select-account-handler/select-account-handler';
/* components */
/* components */
/* providers */
import { BdbInMemoryProvider } from '../providers/storage/bdb-in-memory/bdb-in-memory';
import { TableConfigProvider } from '../providers/table-config/table-config';
import { TabsMenuProvider } from '../providers/tabs-menu/tabs-menu';
import { TabsProvider } from '../providers/tabs/tabs';
import { TokenInterceptor } from '../providers/token-interceptor/token-interceptor';
import { TooltipOpsProvider } from '../providers/tooltip-ops/tooltip-ops';
import { BankReferenceProvider } from '../providers/bank-reference/bank-reference';

import { TransactionsProvider } from '../providers/transactions/transactions';
import { TsErrorProvider } from '../providers/ts-error/ts-error-provider';
import { TuPlusOpsProvider } from '../providers/tu-plus-ops/tu-plus-ops';
import { UnknownBalanceProvider } from '../providers/unknown-balance/unknown-balance';
import { MyApp } from './app.component';
import { CoreModule } from './core/core.module';
import { SettingsMenuProvider } from '../providers/settings-menu/settings-menu';
import { AdnOpsProvider } from '../providers/adn-ops/adn-ops';
import { AngAtomModule } from '@avaldigitallabs/ang-atom';
import { FbogModuleModule } from '@avaldigitallabs/fbog-module';
import { ENV } from '@app/env';
import { EventMapperProvider } from '../providers/funnel-events/events-mapper';
import { RenameBdbPdfProvider } from '../providers/rename-bdb-pdf/rename-bdb-pdf';
import { WebSocketSessionProvider } from '../providers/web-socket-session/web-socket-session';
import { PbitOpsProvider } from '../providers/pbit-ops/pbit-ops';
import { TimeoutProvider } from '../providers/timeout/timeout';
import { BdbCryptoForgeProvider } from '../providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../providers/bdb-hash-base/bdb-hash-base';
import { BdBExcelProvider } from '../providers/bdb-excel/bdb-excel';
import { PulseModalControllerProvider } from '../providers/pulse-modal-controller/pulse-modal-controller';
import { TokenOtpProvider } from '../providers/token-otp/token-otp/token-otp';
import { BdbSecurityRestProvider } from '../providers/bdb-security/bdb-security-rest';
import { BdbSecuritySetupProvider } from '../providers/bdb-security/bdb-security-setup';
import { BdbBankingReportsProvider } from '../providers/bdb-banking-reports/bdb-banking-reports';
import { BdbOtpProvider } from '../providers/bdb-otp-provider/bdb-otp-provider';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { StoreModule, MetaReducer, META_REDUCERS } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { appReducers } from './store/reducers';
import { storageMetaReducer } from './store/metareducers/storage.metareducer';
import { clearStateMetaReducer } from './store/metareducers/clear-state.metareducer';
import { ROOT_STORAGE_KEYS, ROOT_LOCAL_STORAGE_KEY } from './store/app.tokens';
import { ClearStateFacade } from './store/facades/clear-state.facade';
import { PaymentsModule } from '../new-app/modules/payments/payments.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { ProductsDelegateModule } from '@app/delegate/products-delegate/products-delegate.module';
import { ProductsApisModule } from '../new-app/core/services-apis/products/products-apis.module';
import { BdbStorageService } from '../new-app/shared/utils/bdb-storage-service/bdb-storage.service';
import { AppCoreApisModule } from '../new-app/core/services-apis/app-core/app-core-apis.module';
import { SettingsStoreModule } from '../new-app/modules/settings/store/settings-store.module';
import { CustomerSecurityDelegateModule } from '@app/delegate/customer-security-delegate/customer-security-delegate.module';
import { TransfersDelegateModule } from '@app/delegate/transfers-delegate/transfers-delegate.module';
import { TooltipInfoOpsProvider } from '@app/shared/utils/bdb-pulse-ops-services/tooltip-info-ops';
import { TransfersModule } from '../new-app/modules/transfers/transfer.module';
import { UserFeaturesDelegateModule } from '@app/delegate/user-features/user-features-delegate.module';
import { ProductsStoreModule } from '../new-app/shared/store/products/products-store.module';
import { UserStoreModule } from '../new-app/shared/store/user/user-store.module';
import { AvalProductsService } from '../new-app/core/services-apis/products/aval-products/aval-products.service';
import { ProductsModule } from '@app/modules/products/products.module';
import { LoaderStoreModule } from '../new-app/shared/store/loader/loader-store.module';
import {MenuOptionsOpsProvider} from '@app/shared/utils/bdb-pulse-ops-services/menu-options-ops';
import { BdbMicrofrontendEventsService } from '@app/shared/utils/bdb-microfrontend-events-service/bdb-microfrontend-events.service';
import { CardsCampaignModule } from '@app/shared/components/campaigns/cards-campaign/cards-campaign.module';
import {BdbAuthenticationModule} from '@app/modules/authentication/authentication.module';
import {AuthenticatorApiService} from '@app/apis/authenticator/authenticator';
import {BdbLoaderService} from '@app/shared/utils/bdb-loader-service/loader.service';
import {BdbLogoutService} from '@app/modules/authentication/services/logout/logout.service';
import {AuthStoreModule} from '@app/modules/authentication/store/auth-store.module';
import {DispatcherDelegateService} from '@app/delegate/identity-validation-delegate/dispatcher-delegate.service';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];

export const RecapchaProvider = [
  { provide: RECAPTCHA_V3_SITE_KEY, useValue: ENV.RECAPCHA_SITE_KEY }
];

export function getMetaReducers(saveKeys: string[],
  localStorageKey: string,
  storageService: BdbStorageService
): MetaReducer<any>[] {
  return [
    storageMetaReducer(saveKeys, localStorageKey, storageService),
    clearStateMetaReducer()
  ];
}

const ionicOptions = {
  tabsPlacement: 'bottom',
  tabsHideOnSubPages: true,
  platforms: {
    ios: {
      statusbarPadding: true,
    },
    android: {},
  }
};

const extModules = ENV.STAGE_NAME === 'dev' || ENV.STAGE_NAME === 'st' || ENV.STAGE_NAME === 'qa' ? [
  StoreDevtoolsModule.instrument({
    maxAge: 25
  })
] : [];

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    IonicModule.forRoot(MyApp, ionicOptions),
    IonicStorageModule.forRoot(),
    SelectionAvalPageModule,
    CoreModule,
    DeviceDetectorModule.forRoot(),
    AngAtomModule.forRoot(ENV),
    FbogModuleModule.forRoot(ENV),
    RecaptchaV3Module,
    BdbUtilsModule,
    ProductsApisModule,
    StoreModule.forRoot(appReducers),
    extModules,
    EffectsModule.forRoot([]),
    ProductsDelegateModule,
    PaymentsModule,
    UserStoreModule,
    ProductsDelegateModule,
    SettingsStoreModule,
    CustomerSecurityDelegateModule,
    TransfersDelegateModule,
    AppCoreApisModule,
    TransfersModule,
    UserFeaturesDelegateModule,
    ProductsStoreModule,
    ProductsModule,
    LoaderStoreModule,
    CardsCampaignModule,
    BdbAuthenticationModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SelectionAvalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    BdbInMemoryProvider,
    TransactionsProvider,
    GlobalVariablesProvider,
    BdbHttpClient,
    AuthListenerProvider,
    AuthenticatorProvider,
    httpInterceptorProviders,
    BdbPlatformsProvider,
    CarriersRepoProvider,
    InAppBrowser,
    BdbMaskProvider,
    AuthCredentialsProvider,
    ProductsBalancesProvider,
    PaymentsProvider,
    BdbUtilsProvider,
    BdbRsaProvider,
    ProgressBarProvider,
    NavigationProvider,
    FunnelEventsProvider,
    FunnelKeysProvider,
    IdentificationTypeListProvider,
    EnrollProvider,
    BdbModalProvider,
    BdbCryptoProvider,
    File,
    FileOpener,
    DocumentViewer,
    SessionProvider,
    TsErrorProvider,
    BdbValidateAuthProvider,
    QuickAccessProvider,
    AccessDetailProvider,
    CreditCardPaymentProvider,
    CreditPaymentProvider,
    Diagnostic,
    BdbPdfProvider,
    FingerprintAIO,
    Device,
    BdbInMemoryIonicProvider,
    BdbFingerPrintProvider,
    SelectAccountHandlerProvider,
    MobileSummaryProvider,
    LimitsProvider,
    GoogleAnalyticsProvider,
    BillOpsProvider,
    RechargeOpsProvider,
    NetworkInterface,
    AvalOpsProvider,
    EmailProvider,
    ConfigAppProvider,
    AccountOpsProvider,
    CrossSellProvider,
    PinProvider,
    CustomerManagementProvider,
    BdbCookies,
    BdbFavoritesProvider,
    ActivationCardsProvider,
    FilterUtilsProvider,
    CardSecurityProvider,
    OnboardingHomeProvider,
    TabsProvider,
    CardsMapperProvider,
    DatePipe,
    CurrencyPipe,
    CustomCurrencyPipe,
    DecimalPipe,
    BalanceUtilsProvider,
    BdbToastProvider,
    EnrolledAccountOpsProvider,
    HistoryTxProvider,
    { provide: LOCALE_ID, useValue: 'es-CO' },
    DebitCardLockProvider,
    PrivateModeProvider,
    UnknownBalanceProvider,
    TuPlusOpsProvider,
    TableConfigProvider,
    BdbProductsProvider,
    PaymentsMainProvider,
    TabsMenuProvider,
    TooltipOpsProvider,
    BankReferenceProvider,
    SettingsMenuProvider,
    AdnOpsProvider,
    EventMapperProvider,
    RenameBdbPdfProvider,
    WebSocketSessionProvider,
    PbitOpsProvider,
    TimeoutProvider,
    BdBExcelProvider,
    PulseModalControllerProvider,
    TokenOtpProvider,
    BdbCryptoForgeProvider,
    BdbHashBaseProvider,
    BdbSecurityRestProvider,
    BdbSecuritySetupProvider,
    BdbBankingReportsProvider,
    BdbOtpProvider,
    RecapchaProvider,
    AvalProductsService,
    BdbMicrofrontendEventsService,
    {
      provide: ROOT_STORAGE_KEYS, useValue: [
        'billersPaymentState.billerInfoList',
        'billersPaymentState.completed',
        'ccObligationsState.paymentObligations',
        'ccObligationsState.completed',
        'userState',
        'settingsFlowsState',
        'cardsInfoState',
        'productsState',
        'creditCardState',
        'acObligationsState.creditObligations',
        'acObligationsState.completed',
        'limitsState',
        'authState'
      ]
    },
    { provide: ROOT_LOCAL_STORAGE_KEY, useValue: '__app_storage__' },
    {
      provide: META_REDUCERS,
      deps: [ROOT_STORAGE_KEYS, ROOT_LOCAL_STORAGE_KEY, BdbStorageService],
      useFactory: getMetaReducers
    },
    ClearStateFacade,
    TooltipInfoOpsProvider,
    MenuOptionsOpsProvider,
    DispatcherDelegateService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }

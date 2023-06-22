import { CurrencyPipe, DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import {App, Config, Platform, Events, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import { } from 'jasmine';
import { BdbMaskProvider } from '../../providers/bdb-mask/bdb-mask';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { MockProductsProvider } from '../products/products.mock';
import { VoucherOptionsProvider } from './voucher-options';
import { CustomCurrencyPipe } from 'pipes/custom-currency';
import { BdbCryptoForgeProvider } from '../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../../providers/bdb-hash-base/bdb-hash-base';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { BillOpsProvider } from 'providers/bill-ops/bill-ops';
import { BdbHttpClient } from 'providers/bdb-http-client/bdb-http-client';
import { GlobalVariablesProvider } from 'providers/global-variables/global-variables';
import { SessionProvider } from 'providers/authenticator/session';
import { BdbInMemoryIonicProvider } from 'providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { Storage } from '@ionic/storage';
import { StorageMock, NavParamsMock } from 'ionic-mocks';
import { NavMock } from 'mocks-ionic';
import { MockBdbPlatformsProvider } from 'providers/bdb-platforms/bdb-platforms.mock';
import { BdbPlatformsProvider } from 'providers/bdb-platforms/bdb-platforms';
import { CarriersRepoProvider } from 'providers/carriers-repo/carriers-repo';
import { ProgressBarProvider } from 'providers/progress-bar/progress-bar';
import { FunnelKeysProvider } from 'providers/funnel-keys/funnel-keys';
import { FunnelEventsProvider } from 'providers/funnel-events/funnel-events';
import { BdbCryptoProvider } from 'providers/bdb-crypto/bdb-crypto';
import { AccessDetailProvider } from 'providers/access-detail/access-detail';
import { TransactionsProvider } from 'providers/transactions/transactions';
import { BdbRsaProvider } from 'providers/bdb-rsa/bdb-rsa';
import { TsErrorProvider } from 'providers/ts-error/ts-error-provider';
import { BdbModalProvider } from 'providers/bdb-modal/bdb-modal';
import { PaymentsProvider } from 'providers/payments/payments';
import { BdbUtilsProvider } from 'providers/bdb-utils/bdb-utils';
import { CreditCardPaymentProvider } from 'providers/credit-card-payment/credit-card-payment';
import { NavigationProvider } from 'providers/navigation/navigation';
import { RechargeOpsProvider } from 'providers/recharge-ops/recharge-ops';
import { MobileSummaryProvider } from 'components/mobile-summary';
import { TabsProvider } from 'providers/tabs/tabs';
import { ProductsBalancesProvider } from 'providers/products-balances/products-balances';
import { AvalOpsProvider } from 'providers/aval-ops/aval-ops';
import { EventMapperProvider } from 'providers/funnel-events/events-mapper';
import { TimeoutProvider } from 'providers/timeout/timeout';
import { of } from 'rxjs/observable/of';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { PaymentsModule } from 'new-app/modules/payments/payments.module';
import { BdbUtilsModule } from '../../new-app/shared/utils/bdb-utils.module';
import { UserFacade } from '../../new-app/shared/store/user/facades/user.facade';
import {BdbToastProvider} from '../bdb-toast/bdb-toast';

describe('voucher-options', () => {
    let voucherOptions: VoucherOptionsProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: BdbPlatformsProvider, useClass: MockBdbPlatformsProvider },
                CarriersRepoProvider,
                BdbMaskProvider,
                BdbInMemoryProvider,
                ProgressBarProvider,
                FunnelKeysProvider,
                FunnelEventsProvider,
                BdbCryptoProvider,
                BdbHttpClient,
                GlobalVariablesProvider,
                SessionProvider,
                AccessDetailProvider,
                TransactionsProvider,
                BdbRsaProvider,
                TsErrorProvider,
                BdbModalProvider,
                PaymentsProvider,
                BdbUtilsProvider,
                CreditCardPaymentProvider,
                NavigationProvider,
                RechargeOpsProvider,
                MobileSummaryProvider,
                TabsProvider,
                ProductsBalancesProvider,
                VoucherOptionsProvider,
                DatePipe,
                CurrencyPipe,
                CustomCurrencyPipe,
                AvalOpsProvider,
                BdbInMemoryIonicProvider,
                EventMapperProvider,
                BdbRsaProvider,
                TimeoutProvider,
                { provide: Storage, useClass: StorageMock },
                BdbCryptoForgeProvider,
                BdbHashBaseProvider,
                provideMockActions(() => of()),
                BillOpsProvider,
                Events,
                Platform,
                LoadingController,
                App,
                Config,
                ClearStateFacade,
                UserFacade,
                BdbToastProvider,
                ToastController
            ],
            imports: [
                PaymentsModule,
                BdbUtilsModule,
                StoreModule.forRoot({}),
                EffectsModule.forRoot([])
            ]
        });
        voucherOptions = TestBed.get(VoucherOptionsProvider);
    });

    it('should launchVoucherTransfer', () => {
        spyOn(voucherOptions, 'navigateVoucher');
        voucherOptions.launchVoucherTransfer(true, getModalRs(), {
            account: MockProductsProvider.payment,
            accountTo: MockProductsProvider.accountEnrolled,
            amount: '',
            billId: '',
            isAval: true,
            note: '',
            transactionCost: '',
            idempotencyKey: ''
        });
        expect(voucherOptions.navigateVoucher).toHaveBeenCalled();
    });

    function getModalRs() {
        return {
            authCode: '',
            modalCode: '',
            status: 0,
            transactionDate: '',
            transactionFee: '',
            button: {
                aux: '',
                main: ''
            },
            details: [],
            message: '',
            paymentMethod: MockProductsProvider.payment,
            title: ''
        };
    }
});

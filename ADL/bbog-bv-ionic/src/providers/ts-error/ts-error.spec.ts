import {} from 'jasmine';
import { TsErrorProvider } from './ts-error-provider';
import { BdbModalProvider } from '../bdb-modal/bdb-modal';
import { TestBed } from '@angular/core/testing';
import { ModalController, Events, Platform } from 'ionic-angular';
import { BdbPlatformsProvider } from '../bdb-platforms/bdb-platforms';
import { AccessDetailProvider } from '../access-detail/access-detail';
import { ProgressBarProvider } from '../progress-bar/progress-bar';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { ModalControllerMock } from 'ionic-mocks';
import { BdbCryptoProvider } from '../bdb-crypto/bdb-crypto';
import { ModalRs } from 'app/models/modal-rs/modal-rs';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { CustomCurrencyPipe } from 'pipes/custom-currency';
import { BdbCookies } from '../../providers/bdb-cookie/bdb-cookie';

describe('provider: TsErrorProvider', () => {
    let tsError: TsErrorProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TsErrorProvider,
                BdbModalProvider,
                { provide: ModalController, useClass: ModalControllerMock},
                BdbPlatformsProvider,
                Events,
                AccessDetailProvider,
                ProgressBarProvider,
                BdbMaskProvider,
                BdbInMemoryProvider,
                Platform,
                BdbCryptoProvider,
                DatePipe,
                CurrencyPipe,
                CustomCurrencyPipe,
                BdbCookies
            ]
        });

        tsError = TestBed.get(TsErrorProvider);
    });

    it('should launch general error', () => {
        const ex = {
            message: 'error'
        };
        const bdbModal: BdbModalProvider = TestBed.get(BdbModalProvider);
        spyOn(bdbModal, 'launchErrModal');
        tsError.launchErrorModal(ex);
        expect(bdbModal.launchErrModal).toHaveBeenCalled();
    });

    it('should launch specific error', () => {
        const ex: ModalRs = {
            authCode: '',
            transactionFee: '',
            transactionDate: '',
            modalCode: '',
            status: 100,
            title: 'title',
            button: {
                main: '',
                aux: null
            }
        };
        const bdbModal: BdbModalProvider = TestBed.get(BdbModalProvider);
        spyOn(bdbModal, 'launchErrModal');
        tsError.launchErrorModal(ex);
        expect(bdbModal.launchErrModal).toHaveBeenCalled();
    });
});

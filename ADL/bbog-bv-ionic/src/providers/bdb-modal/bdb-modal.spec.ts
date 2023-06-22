import { TestBed } from '@angular/core/testing';
import { ModalController } from 'ionic-angular';
import { BdbModalProvider } from '../bdb-modal/bdb-modal';
import { } from 'jasmine';
import { AccessDetailProvider } from '../access-detail/access-detail';
import { ProgressBarProvider } from '../progress-bar/progress-bar';
import { BdbMaskProvider } from '../bdb-mask/bdb-mask';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../../pipes/custom-currency';
import { BdbCookies } from '../../providers/bdb-cookie/bdb-cookie';
import { BdbCryptoForgeProvider } from '../../providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../../providers/bdb-hash-base/bdb-hash-base';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { Store, StoreModule } from '@ngrx/store';
import { StorageMock } from 'ionic-mocks';
import { EffectsModule } from '@ngrx/effects';

describe('bdb modal provider test suite', () => {

    let bdbModal: BdbModalProvider;
    let modalSpy;
    let modalDismissSpy;
    let modalCtrlSpy;
    let bdbCookies;

    beforeEach(() => {
        modalSpy = jasmine.createSpyObj('Modal', ['present']);
        modalDismissSpy = jasmine.createSpyObj('Modal', ['onDidDismiss']);
        modalDismissSpy.onDidDismiss.and.callFake(() => {
            return;
        });
        modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create']);
        modalCtrlSpy.create.and.callFake(() => {
            return modalSpy;
        });
    });

    afterEach(() => {
        modalSpy = null;
        modalCtrlSpy = null;
        bdbCookies = null;
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BdbModalProvider,
                {
                    provide: ModalController,
                    useValue: modalCtrlSpy
                },
                {
                    provide: BdbCookies,
                    useValue: bdbCookies
                }
            ]
        }).compileComponents();
        bdbModal = new BdbModalProvider(modalCtrlSpy, bdbCookies);
    });

    xit('should launch error modal', () => {
        bdbModal.launchErrModal('testing', 'error modal', 'OK', () => {
            console.log('dismissed');
        });
        expect(modalSpy.present).toHaveBeenCalled();
    });

});

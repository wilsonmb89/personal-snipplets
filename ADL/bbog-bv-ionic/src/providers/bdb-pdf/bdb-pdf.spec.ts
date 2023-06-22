import { } from 'jasmine';
import { BdbPdfProvider } from './bdb-pdf';
import { TestBed } from '@angular/core/testing';
import { BdbUtilsProvider } from '../bdb-utils/bdb-utils';
import { Platform, ToastController, Toast, App, Config } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { ProductDetail } from 'app/models/products/product-model';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { BdbCryptoProvider } from '../bdb-crypto/bdb-crypto';
import { BdbRsaProvider } from '../bdb-rsa/bdb-rsa';
import { mockApp } from 'ionic-angular/util/mock-providers';
import { ProductExtractsRs } from 'app/models/extracts/product-extracts-response';
import { BdbToastProvider } from 'providers/bdb-toast/bdb-toast';
import { BdbPlatformsProvider } from 'providers/bdb-platforms/bdb-platforms';
import { BdbCryptoForgeProvider } from '../bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from '../bdb-hash-base/bdb-hash-base';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

describe('provider: BdbPdf', () => {
    let bdbPdf: BdbPdfProvider;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: App, useValue: mockApp() },
                BdbPdfProvider,
                BdbUtilsProvider,
                Platform,
                Diagnostic,
                DocumentViewer,
                InAppBrowser,
                FileOpener,
                ToastController,
                File,
                BdbInMemoryProvider,
                BdbCryptoProvider,
                BdbCryptoForgeProvider,
                BdbHashBaseProvider,
                BdbRsaProvider,
                Config,
                BdbToastProvider,
                BdbPlatformsProvider,
                ClearStateFacade
            ],
            imports: [
                StoreModule.forRoot({}),
                EffectsModule.forRoot([])
            ]
        });
        bdbPdf = TestBed.get(BdbPdfProvider);
    });

    it('should return file name', () => {
        const p: ProductDetail = {
            amount: 1000,
            isAval: true,
            isActive: false,
            description: '',
            productBank: 'BO',
            productName: 'Cuenta de Ahorros',
            productNumber: '242342',
            productNumberX: '****242342',
            productType: 'ST',
            bankId: '00010016'
        };
        const name: string = bdbPdf.buildFileName(p, '2019-12', 'docs');
        expect(name).toEqual('docsCuentadeAhorros_2019-12');
        const pr: ProductDetail = {
            amount: 1000,
            isAval: true,
            isActive: false,
            description: '',
            productBank: 'BO',
            productNumber: '242342',
            productNumberX: '****242342',
            productName: undefined,
            productType: 'ST',
            bankId: '00010016'
        };
        const name2: string = bdbPdf.buildFileName(pr, '2019-12', 'docs');
        expect(name2).toEqual('docs_2019-12');
    });

    it('should return options object for doc viewer', () => {
        expect(bdbPdf.getDocViewerOptions()).not.toBeNull();
    });

    it('should present toast', () => {
        const toast: ToastController = TestBed.get(ToastController);
        const mockToast: Toast = toast.create({
            message: 'mocktoast',
            duration: 1,
        });
        spyOn(mockToast, 'present').and.callThrough();
        spyOn(toast, 'create').and.returnValue(mockToast);
        bdbPdf.showToast('C');
        expect(mockToast.present).toHaveBeenCalled();
    });

    it('should return blob', () => {
        const data: ProductExtractsRs = {
            binData: '',
            binLength: '',
            statusDesc: ''
        };
        const blob: Blob = bdbPdf.getBlob(data);
        expect(blob).not.toBeNull();
    });
});

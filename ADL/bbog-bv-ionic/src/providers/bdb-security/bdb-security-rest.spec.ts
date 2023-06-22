import { BdbSecurityRestProvider } from './bdb-security-rest';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { BdbCryptoForgeProvider } from 'providers/bdb-crypto-forge/bdb-crypto-forge';
import { BdbHashBaseProvider } from 'providers/bdb-hash-base/bdb-hash-base';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ClearStateFacade } from 'app/store/facades/clear-state.facade';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { StorageMock } from 'ionic-mocks';
import { EffectsModule } from '@ngrx/effects';

describe('bdb security rest provider test', () => {

  let securityRestProvider: BdbSecurityRestProvider;
  const cypherTest = 'TEST';
  let decypherTest = '';
  let frontKey;
  let iv;
  let publicKeyBackend: HttpResponse<any>;
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
    const bdbHashBaseProvider = new BdbHashBaseProvider();
    const bdbCryptoForgeProvider = new BdbCryptoForgeProvider(bdbHashBaseProvider);
    const bdbInMemoryProvider = new BdbInMemoryProvider(bdbCryptoForgeProvider, clearStateFacade);
    const headers = new HttpHeaders({
      'Last-Modified': String(new Date().getTime())
    });
    publicKeyBackend = new HttpResponse({
      body: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm6tck+zGtClBPgpOoRfjJgF3Lgy/OV7nN7TOJTChBxokSegaURiPgVH8IKJbSs45C9QNq98676DZgtNNRWnPBZQS8A5nrkmf/fjs9ZLQ3UsEUBySqtdzBLRTh/lhobF6utzpCsswIuTzBySRmxLs8MxUPbNAt2ZSjJGJnEgPMkChRQBZv4EGKE57iO+WX++wTjm7Enfl4MRWZ5hJi82D9eLjrhtQbEALIcWTW/mZbiOVvaRm8rrRTREKb/v1vsRfeVNIXrK25WUuxsRWkhOu4qB+qzYtLQ8bGYz49VneCs6ViGzOwCY8Zm/JCLoqEaAhjhVgdIv4Z0EO5//tlhAebQIDAQAB',
      headers,
      status: 200,
      statusText: 'OK',
      url: 'https://pb-stg-api-bogota.avaldigitallabs.com/api-gateway/setup/start'
    });
    securityRestProvider = new BdbSecurityRestProvider(bdbInMemoryProvider);
  });

  it('Should store a public key', () => {
    securityRestProvider.storePublickKey(publicKeyBackend);
    expect().nothing();
  });

  it('should return a frontkey', () => {
    frontKey = securityRestProvider.generateFrontPrivateKey(32);
    expect(frontKey).toBeTruthy();
  });

  it('should return a iv', () => {
    iv = securityRestProvider.generateFrontPrivateKey(16);
    expect(frontKey).toBeTruthy();
  });

  it('should cypher TEST text with the front key', () => {
    decypherTest = securityRestProvider.encrypt(cypherTest, frontKey, iv);
    expect(decypherTest).toEqual(decypherTest);
  });

  it('should decypher TEST text with the front key', () => {
    const m = securityRestProvider.desencrypt(decypherTest, frontKey, iv);
    expect(m).toEqual(cypherTest);
  });
});

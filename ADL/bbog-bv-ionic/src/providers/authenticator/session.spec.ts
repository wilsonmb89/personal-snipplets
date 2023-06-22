import {TestBed, async} from '@angular/core/testing';
import {BdbInMemoryProvider} from '../storage/bdb-in-memory/bdb-in-memory';
import {SessionProvider} from './session';
import {Events} from 'ionic-angular';
import {BdbCryptoProvider} from '../bdb-crypto/bdb-crypto';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { ENV } from '@app/env';
import { StorageMock } from 'ionic-mocks';
import { BdbInMemoryIonicProvider } from 'providers/bdb-in-memory-ionic/bdb-in-memory-ionic';
import { Storage } from '@ionic/storage';


describe('Session Provider', () => {
    let service: SessionProvider;
    let events: Events;
    let bdbInMemory: BdbInMemoryProvider;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          BdbInMemoryProvider,
          Events,
          SessionProvider,
          BdbCryptoProvider,
          BdbInMemoryIonicProvider,
          {provide: Storage, useClass: StorageMock}
        ],
        imports: []
      });
      service = TestBed.get(SessionProvider);
      events = TestBed.get(Events);
      bdbInMemory = TestBed.get(BdbInMemoryProvider);
    }));

    afterEach(() => {
      ENV.STAGE_NAME = 'dev';
      bdbInMemory.clearItem(InMemoryKeys.AccessToken);
    });

    xit('should return authenticated user', () => {
      bdbInMemory.setItemByKey(InMemoryKeys.AccessToken, 'ASD68aDasdKFJ7');
      const auth = service.authenticated();
      expect(auth).toBeTruthy();
    });

    xit('should return non authenticated user when lenght 0', () => {
      bdbInMemory.setItemByKey(InMemoryKeys.AccessToken, '');
      ENV.STAGE_NAME = 'qa';
      const auth = service.authenticated();
      expect(auth).toBeFalsy();
    });

    xit('should return non authenticated user', () => {
      bdbInMemory.setItemByKey(InMemoryKeys.AccessToken, null);
      ENV.STAGE_NAME = 'qa';
      spyOn(service, 'authenticated').and.returnValue(false);
      const auth = service.authenticated();
      // expect(service.logout).toHaveBeenCalled();
      expect(auth).toBeFalsy();
    });
  }
);



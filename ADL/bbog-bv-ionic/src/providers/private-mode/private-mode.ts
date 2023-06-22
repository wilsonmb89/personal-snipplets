import { Injectable } from '@angular/core';
import { BdbHttpClient } from '../../providers/bdb-http-client/bdb-http-client';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';

@Injectable()
export class PrivateModeProvider {

  constructor(
    private bdbHttpClient: BdbHttpClient,
    private bdbInMemoryProvider: BdbInMemoryProvider
  ) { }

  public updateKeyPrivateMode(activated: boolean) {
    this.bdbInMemoryProvider.setItemByKey(InMemoryKeys.PrivateMode, activated);
  }


}

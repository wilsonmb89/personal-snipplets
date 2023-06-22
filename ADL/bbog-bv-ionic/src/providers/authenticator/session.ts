import { Injectable } from '@angular/core';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { ENV } from '@app/env';
import { Events } from 'ionic-angular';
import { App } from 'ionic-angular';

@Injectable()
export class SessionProvider {

  constructor(private bdbInMemory: BdbInMemoryProvider, private appCtrl: App) {}

  public authenticated(): boolean {

    const token: string = this.bdbInMemory.getItemByKey(InMemoryKeys.AccessToken);

    if ((token && token !== null && token.length > 0) || ENV.STAGE_NAME === 'dev') {
      return true;
    } else {
      this.appCtrl.getRootNav().push('authentication/logout');
      return false;
    }
  }

}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InMemoryKeys } from '../../providers/storage/in-memory.keys';
import { BdbInMemoryProvider } from '../../providers/storage/bdb-in-memory/bdb-in-memory';
import { webSocket } from 'rxjs/observable/dom/webSocket';
import { ENV } from '@app/env';
import { Events } from 'ionic-angular';
import { BdbInMemoryIonicProvider } from '../../providers/bdb-in-memory-ionic/bdb-in-memory-ionic';

@Injectable()
export class WebSocketSessionProvider {

  url = ENV.API_BDB_WS;
  socket$: any;

  constructor(
    public http: HttpClient,
    private bdbInMemory: BdbInMemoryProvider,
    private events: Events,
    private ionicStorage: BdbInMemoryIonicProvider
  ) { }

  newConnection() {

    const accessTokenOpenSession = this.bdbInMemory.getItemByKey(InMemoryKeys.AccessTokenOpenSession);
    const params = new HttpParams()
      .set('accessToken', accessTokenOpenSession);

    this.socket$ = webSocket({
      url: `${this.url}?${params.toString()}`
    });
    this.socket$.subscribe(
      msg => this.socketOn(msg),
      err => console.log(err),
      () => console.log('complete')
    );

    this.validateSession();

    setInterval(() => {
      this.validateSession();
    }, 120000);
  }

  socketOn(msg: any) {

    switch (msg.on) {
      case 'logout-session':
        this.socket$.complete();
        this.bdbInMemory.clearAll();
        this.events.publish('user:logout', { typeClose: 'expired' });
        break;
      case 'validate-session':
        this.validateSession();
        break;
      default:
        break;
    }
  }

  validateSession() {
    const accessToken = this.bdbInMemory.getItemByKey(InMemoryKeys.AccessToken);
    const message = JSON.stringify({
      action: 'validate-session',
      data: {
        accessToken
      }
    });

    this.socket$.next(message);
  }

  public wsSessionValidate() {

    const accessToken = this.bdbInMemory.getItemByKey(InMemoryKeys.AccessToken);
    const identificationNumber = this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationNumber);
    const identificationType = this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationType);

    if (!!accessToken && !!identificationNumber && !!identificationType && !this.socket$) {
      this.newConnection();
    }
  }

  public wsSessionClosed() {
    if (!!this.socket$) {
      this.socket$.complete();
    }
  }

}

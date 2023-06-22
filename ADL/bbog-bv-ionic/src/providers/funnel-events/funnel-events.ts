import { Injectable } from '@angular/core';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { ENV } from '@app/env';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { FunnelPayload } from './funnel-payload';
import { FunnelKeyModel } from '../funnel-keys/funnel-key-model';
import { FunnelKeysProvider } from '../funnel-keys/funnel-keys';
import { BdbCryptoProvider } from '../bdb-crypto/bdb-crypto';
@Injectable()
export class FunnelEventsProvider {

  enrollKeysArray = [
    {
      key: 'cc',
      value: this.funnelKeys.getKeys().enrollCreditCards
    },
    {
      key: 'transfer',
      value: this.funnelKeys.getKeys().enrollAccounts
    }, {
      key: 'credit',
      value: this.funnelKeys.getKeys().enrollCredits
    }
  ];

  constructor(
    public bdbHttpClient: BdbHttpClient,
    public bdbInMemory: BdbInMemoryProvider,
    private funnelKeys: FunnelKeysProvider,
    private bdbCryptoJs: BdbCryptoProvider
  ) { }

  emit(funnelPayload: FunnelPayload) {
    const funnelUrl = ENV.FUNNEL_URL;
    const productId = '6';
    const payload = {
      'accessToken': this.bdbInMemory.getItemByKey(InMemoryKeys.AccessToken),
      'idNumber': this.bdbInMemory.getItemByKey(InMemoryKeys.IdentificationNumber),
      'channel': 'WEB',
      'client': true,
      'device': '',
      'browser': '',
      'productId': productId,
      'eventDate': new Date(),
      'journey': funnelPayload.journey,
      'step': funnelPayload.step,
      'httpStatus': funnelPayload.httpStatus === null ? '200' : funnelPayload.httpStatus,
      'level': 'info',
      'exitCode': funnelPayload.exitCode === null ? '' : funnelPayload.exitCode,
      'description': funnelPayload.description === null ? '' : funnelPayload.description
    };
    const dataBase64 = btoa(JSON.stringify(payload));
    const body = {
      messageType: this.bdbCryptoJs.encrypt('bdb-funnel'),
      messageContent:  this.bdbCryptoJs.encrypt(dataBase64)
    };
      this.bdbHttpClient.post('publish/secure', body, funnelUrl).subscribe(
      next => {
      },
      error => {
        console.error(error);
      }
    );
  }


  public callFunnel(_funnel: FunnelKeyModel, step) {
    const funnelPayload = {
      journey: _funnel.key,
      step
    };
    this.emit(funnelPayload);
  }

  matchFunnelKey(origin: string): FunnelKeyModel {
    return this.enrollKeysArray.find((e) => {
      return e.key === origin;
    }).value;
  }
}

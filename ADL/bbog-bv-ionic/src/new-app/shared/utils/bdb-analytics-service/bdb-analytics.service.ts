import { Injectable } from '@angular/core';
import { Events, Platform } from 'ionic-angular';
import { BdbInMemoryProvider } from '../../../../providers/storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../../../../providers/storage/in-memory.keys';
import { BdbCypherService } from '../bdb-cypher-service/bdb-cypher.service';
import { CONST } from '../bdb-constants/constants';
import { LoadScriptService } from '../bdb-load-script-service/load-script.service';

declare var dataLayer: Array<any>;

@Injectable()
export class BdbAnalyticsService {

  constructor(
    private events: Events,
    public platform: Platform,
    private bdbInMemoryProvider: BdbInMemoryProvider,
    private loadScriptService: LoadScriptService,
    private bdbCypherService: BdbCypherService
  ) {

  }

  public initAnalytics(): void {
    this.loadScriptService.loadGTMScripts();
    this.enabledAnalyticsEvent();
  }

  public pushToDataLayer(data: object): void {
    dataLayer.push(data);
  }


  /**
   * Set user info in dataLayer for bluekai and responsys
   *
   * @param documentType
   * @param documentNumber
   */
  public pushAnalyticsUserInfo(documentType: string, documentNumber: string): void {
    const data = CONST.document_types
      .filter(value => value.value === documentType)
      .map(value => value.analyticsCode)[0] + documentNumber;


    this.pushToDataLayer({
      event: 'analyticsHash',
      data: this.bdbCypherService.toSha256(data).toLowerCase()
    });
  }


  private enabledAnalyticsEvent() {
    this.events.subscribe('view:enter', (obj) => {
      this.trackPage(obj);
    });
  }

  private trackPage(page: { name, title }) {
    const id = this.bdbInMemoryProvider.getItemByCryptId(InMemoryKeys.IdCryptAnalytic);
    dataLayer.push({
      'screenPath': page.name,
      'screenName': page.title,
      'trackId': id
    });
    dataLayer.push({'event': 'appScreenView'});
  }


}

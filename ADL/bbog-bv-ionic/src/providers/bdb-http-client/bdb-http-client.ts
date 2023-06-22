import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariablesProvider } from '../global-variables/global-variables';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { tap } from 'rxjs/operators/tap';
import { ENV } from '@app/env';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { RequestEvents } from '../../app/models/analytics-event/request-event';
import { EventMapperProvider } from '../../providers/funnel-events/events-mapper';
import { GeneralData, PayloadEvent } from '../../app/models/analytics-event/analytics-rq';
import { BdbCryptoProvider } from '../../providers/bdb-crypto/bdb-crypto';
import { App } from 'ionic-angular';

const funnelUrl = ENV.FUNNEL_URL;

@Injectable()
export class BdbHttpClient {

  constructor(
    public http: HttpClient,
    private globalVar: GlobalVariablesProvider,
    private bdbInMemory: BdbInMemoryProvider,
    public eventsMapper: EventMapperProvider,
    private bdbCryptoJs: BdbCryptoProvider,
    public appCtrl: App
  ) { }

  get<T>(resource: string, params: any, url = this.globalVar.apiUrl, analyticsInfo?: RequestEvents): Observable<T> {
    return this.http.get<T>(url + resource, {
      params
    }).pipe(
      tap( // Log the result or error
        data => this.sendAnalyticsEvent(data, analyticsInfo),
        error => this.sendAnalyticsEventError(error, analyticsInfo)
      )
    );
  }

  simpleGet(resource: string): Observable<any> {
    return this.http.get(this.globalVar.apiUrl + resource, { responseType: 'text' });
  }

  post<T>(resource: string, body: any,
    url = this.globalVar.apiUrl,
    headerOptions?: any,
    analyticsInfo?: RequestEvents): Observable<T> {
    const  headers = !!headerOptions ? new HttpHeaders(headerOptions) : null;


    return new Observable<T>(o => {
      this.http.post<T>(
        url + resource,
        body,
        { headers }
      ).pipe(
        tap( // Log the result or error
          data => this.sendAnalyticsEvent(data, analyticsInfo),
          error => this.sendAnalyticsEventError(error, analyticsInfo)
        )
      ).subscribe(
        (res) => {
          o.next(res);
          o.complete();

      }, (e) => {
        o.error(e);
        o.complete();
      });

    });

  }

  postOptions<T>(resource: string, body: any,
    url = this.globalVar.apiUrl,
    options?: any,
    analyticsInfo?: RequestEvents) {
    return this.http.post<T>(
      url + resource,
      body,
      options
    ).pipe(
      tap( // Log the result or error
        data => this.sendAnalyticsEvent(data, analyticsInfo),
        error => this.sendAnalyticsEventError(error, analyticsInfo)
      )
    );
  }

  put<T>(resource: string, body: any, url = this.globalVar.apiUrl, headerOptions?: any, analyticsInfo?: RequestEvents): Observable<T> {
    const headers = headerOptions ? new HttpHeaders(headerOptions) : null;
    return this.http.put<T>(
      url + resource,
      body,
      { headers }
    ).pipe(
      tap( // Log the result or error
        data => this.sendAnalyticsEvent(data, analyticsInfo),
        error => this.sendAnalyticsEventError(error, analyticsInfo)
      )
    );
  }

  private log<T>(data: any) {
    if (ENV.STAGE_NAME !== 'pr') {
      console.log('******** PIPE *********');
      console.log(data);
    }
  }

  private sendAnalyticsEvent<T>(data: any, analyticsInfo: RequestEvents) {
    if (!!analyticsInfo) {
      analyticsInfo.aditionalInfo.push({ 'key': 'statusCode', 'value': 200 });
      this.emitAnalytics(this.eventsMapper.mapper(true, analyticsInfo.transactionsCode, analyticsInfo.aditionalInfo));
    }
    this.log(data);
  }

  emitAnalytics(payload: GeneralData) {
    const eventUrl = ENV.API_ADL_ANALYTICS;
    const cipherPayload = this.bdbCryptoJs.encrypt(payload);
    const payloadEvent: PayloadEvent = new PayloadEvent(ENV.STREAM_NAME, cipherPayload, ENV.PARTITION_KEY);
    this.post('event', payloadEvent , eventUrl).subscribe(
      next => {},
      error => {
        console.error(error);
      }
    );
  }

  private sendAnalyticsEventError<T>(httpErrorResponse: HttpErrorResponse, analyticsInfo: RequestEvents) {
    if (!!analyticsInfo) {
      analyticsInfo.aditionalInfo.push({ 'key': 'statusCode', 'value': httpErrorResponse.status });
      this.emitAnalytics(this.eventsMapper.mapper(false, analyticsInfo.transactionsCode, analyticsInfo.aditionalInfo));
    }
    this.handleError(httpErrorResponse);
  }

  private handleError<T>(httpErrorResponse: HttpErrorResponse) {
    if (ENV.STAGE_NAME !== 'pr') {
      console.error('******** HANDLE ERROR *********');
      console.error(httpErrorResponse);
    }

    if (
      httpErrorResponse.url &&
      !httpErrorResponse.url.match(/authentication|ath\/secure-password|ath\/debit-card/) &&
      httpErrorResponse.status === 401
    ) {
      const isFromFrame = this.bdbInMemory.getItemByKey(InMemoryKeys.IsLoginFromFrame);
      if (isFromFrame === null) {
        this.appCtrl.getRootNav().push('ExpiredSessionPage');
      }
    }

  }
}

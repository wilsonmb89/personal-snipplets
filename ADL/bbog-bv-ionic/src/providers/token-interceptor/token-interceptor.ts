import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { ENV } from '@app/env';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public bdbInMemoryProvider: BdbInMemoryProvider) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.match(/\/api-gateway\//)) {
      const authToken = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.AccessToken);
      // TO DO: Delete this const when auth is completely migrated
      const tokenVersion =  this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.TokenVersion);
      if (!!authToken) {
        req = req.clone({headers: req.headers.set('Authorization', authToken)});
        if (!!tokenVersion && tokenVersion === '2') {
          req = req.clone({headers: req.headers.set('X-Version', '2')});
        }
      }
      if (!req.headers.has('Content-Type') && !req.headers.has('Disabled-Content-Type')) {
        req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
      }
      req = req.clone({ headers: req.headers.set('Channel', 'PB') });
      return next.handle(req);
    }

    if (!req.url.match(/cards/) &&
      req.url.match(/authentication|publish|bdbHealthyStaging|health|security|rsa|ath\/secure-password|ath\/debit-card/)) {
      return next.handle(req);
    }

    const accessToken = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.AccessToken);
    const identificationNumber = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.IdentificationNumber);
    const identificationType = this.bdbInMemoryProvider.getItemByKey(InMemoryKeys.IdentificationType);

    let tokenHeaders = req.url.match(/adn/) ? req.headers : new HttpHeaders( );
    tokenHeaders = tokenHeaders.set('access-token', accessToken == null ? 'NOTOKEN' : accessToken);
    tokenHeaders = tokenHeaders.set('identification-number', identificationNumber == null || identificationType == null ? btoa('NOTUSER') :
      btoa(identificationNumber + identificationType));

    const interceptedRequest = req.clone({ headers: tokenHeaders });
    return next.handle(interceptedRequest);
  }

}

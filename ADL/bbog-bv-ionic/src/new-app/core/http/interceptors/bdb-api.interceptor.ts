import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ENV } from '@app/env';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { BdbSecurityRestProvider } from '../../../shared/security/bdb-security-rest';
import { UserFacade } from '../../../shared/store/user/facades/user.facade';


@Injectable()
export class BdbApiInterceptor implements HttpInterceptor {

  constructor(
    private bdbSecurityRestProvider: BdbSecurityRestProvider,
    private userFacade: UserFacade
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (ENV.STAGE_NAME.match(/dev|qa/) || this.validateNotCypherURL(req.url)) {
      return next.handle(req);
    }

    return this.userFacade.user$.pipe(
      take(1),
      switchMap(({ publicKey, diffTime }) => this.handleRequest(req, next, publicKey, diffTime))
    );
  }

  private handleRequest(req: HttpRequest<any>, next: HttpHandler, publicKey: string, diffTime: number): Observable<any> {
    const frontPrivateKey = this.bdbSecurityRestProvider.generateFrontPrivateKey(32);
    const iv = this.bdbSecurityRestProvider.generateFrontPrivateKey(16);
    const body = this.bdbSecurityRestProvider.encryptBody(JSON.stringify(req.body), frontPrivateKey, iv);
    const cypheringStrategyModel = this.bdbSecurityRestProvider.generateCypheringStrategy(frontPrivateKey, body, iv, diffTime);
    const cypherFrontPrivateKey = this.bdbSecurityRestProvider
      .generateCypherFrontPrivateKey(JSON.stringify(cypheringStrategyModel), publicKey);
    req = req.clone({headers: req.headers.set('stat_ref', `${cypherFrontPrivateKey}`)});
    req = req.clone({body});
    req = req.clone({responseType: 'text'});

    return next.handle(req).pipe(
      map(
        (event: HttpEvent<any>) => {
          try {
            if (event instanceof HttpResponse) {
              let decriptedBody;
              const bodyRes = !!event.body.body ? event.body.body : event.body;
              decriptedBody = this.bdbSecurityRestProvider.decryptBody(bodyRes, frontPrivateKey, iv);
              event = event.clone({body: decriptedBody});
            }
            return event;
          } catch (error) {
            console.error('Error en ' + req.url);
            console.error(error);
            return event;
          }
        }
      ),
      catchError(
        errorEvent => {
          if (!errorEvent.error) {
            return ErrorObservable.create(errorEvent);
          }
          const error = this.bdbSecurityRestProvider.decryptBody(errorEvent.error, frontPrivateKey, iv);
          const newErrorEvent = {...errorEvent, error};
          return ErrorObservable.create(newErrorEvent);
        }
      )
    );
  }

  private validateNotCypherURL(url: string) {
    return (url.match(/\/api-gateway\/setup\/start/) || !url.match(/\/api-gateway\//));
  }

}

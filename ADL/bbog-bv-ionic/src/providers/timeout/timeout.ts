import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';

@Injectable()
export class TimeoutProvider {

  constructor() { }

  // TODO: DELETE THIS FUNCTION...
  validateTimeOut(process: Observable<any>): Observable<any> {
    return new Observable(observer => {
      process.subscribe(
        (data) => {
          observer.next(data);
          observer.complete();
        },
        (ex) => {
          if (ex.status === 503) {
            process
              .retryWhen(errors => errors.delay(5000).take(4)
                .concat(Observable.throw('Error...')))
              .subscribe((retryData) => {
                observer.next(retryData);
                observer.complete();
              }, (retryEx) => {
                observer.error(retryEx);
              });
          } else {
            observer.error(ex);
          }
        }
      );
    });
  }

  addParameterIdempotencyKey(): string {
    return `?idempotenceKey=${UUID.UUID()}`;
  }

}

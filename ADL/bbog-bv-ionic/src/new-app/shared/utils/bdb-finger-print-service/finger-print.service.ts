import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FingerPrintService {

  private MPFingerprint = window['MPFingerprint'];

  public getFraudDetectorFingerPrint(): Observable<string> {
    return Observable.fromPromise(this.MPFingerprint.getData());
  }

}

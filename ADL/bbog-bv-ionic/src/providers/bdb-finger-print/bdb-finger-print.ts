import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';
import { FingerPrintDevice } from '../../app/models/finger-print-device';
import { FingerPrintValidateRq } from '../../app/models/finger-prin-validate-rq';
import { FingerPrintSaveRq } from '../../app/models/finger-print-save-rq';
import { BdbInMemoryIonicProvider } from '../bdb-in-memory-ionic/bdb-in-memory-ionic';
import { InMemoryKeys } from '../storage/in-memory.keys';
import 'rxjs/add/observable/fromPromise';

@Injectable()
export class BdbFingerPrintProvider {


  constructor(private bdbHttpClient: BdbHttpClient,
              private ionicStorage: BdbInMemoryIonicProvider) {
  }

  validateDeviceId(deviceId: string): Observable<FingerPrintDevice> {
    if (deviceId === null || deviceId === '' || deviceId === undefined) {
      return Observable.of(new FingerPrintDevice(null, 0));
    } else {

      return Observable.fromPromise(this.ionicStorage.get(InMemoryKeys.FingerPrintData).then((data) => {
        if (data) {
          return new FingerPrintDevice(deviceId, 1, true);
        } else {
          return new FingerPrintDevice(deviceId, 0, false);
        }
      }));
    }
  }

  save(fingerPrintSaveRq: FingerPrintSaveRq): Observable<FingerPrintDevice> {
    return Observable.fromPromise(this.ionicStorage.set(InMemoryKeys.FingerPrintData, fingerPrintSaveRq).then(() => {
      return new FingerPrintDevice(fingerPrintSaveRq.deviceId, 1);
    }));
  }

  delete(deviceId: string): Observable<FingerPrintDevice> {
    if (deviceId === null || deviceId === '' || deviceId === undefined) {
      return Observable.of(new FingerPrintDevice(null, 0));
    } else {

      return Observable.fromPromise(this.ionicStorage.remove(InMemoryKeys.FingerPrintData).then(() => {
          return new FingerPrintDevice(deviceId, 0);
        }
      ));
    }
  }

}

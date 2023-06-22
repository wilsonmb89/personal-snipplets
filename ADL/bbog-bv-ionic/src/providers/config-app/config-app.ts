import { Injectable } from '@angular/core';
import { NetworkInterface } from '@ionic-native/network-interface';
import { InMemoryKeys } from '../storage/in-memory.keys';
import { BdbInMemoryProvider } from '../storage/bdb-in-memory/bdb-in-memory';
import { BdbPlatformsProvider } from '../bdb-platforms/bdb-platforms';
import { BdbInMemoryIonicProvider } from '../bdb-in-memory-ionic/bdb-in-memory-ionic';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { BvDataApp, FingerStatus, DataToLogin, InfoDevice } from '../../app/models/bv-data-app';
import { Device } from '@ionic-native/device';
import { ENV } from '@app/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BdbHttpClient } from '../bdb-http-client/bdb-http-client';

@Injectable()
export class ConfigAppProvider {

  private readonly LOGIN_PAGE = 'LoginPage';
  // temporalmente se deshabilita mientras se termina la refactorizacion del finger
  // private readonly LOGIN_FINGER_PAGE = 'LoginFingerPage';
  private LOGIN_FINGER_PAGE;

  constructor(
    private networkInterface: NetworkInterface,
    private bdbInMemory: BdbInMemoryProvider,
    private bdbPlatform: BdbPlatformsProvider,
    private ionicStorage: BdbInMemoryIonicProvider,
    private fingerprintAIO: FingerprintAIO,
    private device: Device,
    private http: BdbHttpClient
  ) {
    // temporalmente  mientras se termina la refactorizacion del finger
    this.LOGIN_FINGER_PAGE = (ENV.STAGE_NAME === 'dev') ? 'LoginFingerPage' : this.LOGIN_PAGE;
  }

  // Configuracion de pagina de inicio

  public dataStorageAction(): Promise<DataToLogin> {
    if (this.bdbPlatform.isApp()) {
      return this.dataStorageApp();
    }
    return Promise.resolve(this.dataStorageBrowser());
  }

  private dataStorageBrowser(): DataToLogin {
    this.bdbInMemory.setItemByKey(InMemoryKeys.BvDataApp, new BvDataApp('BROWSER', null, FingerStatus.NONE, 'WEB'));
    return new DataToLogin(this.LOGIN_PAGE, FingerStatus.NONE);

  }

  private async dataStorageApp(): Promise<DataToLogin> {

    const d: InfoDevice = await this.setData();
    if (!d.avilableFinger && !d.actualStorage) {
      d.actualStorage = new BvDataApp(this.device.uuid, null, FingerStatus.NONE, this.device.model);
      this.ionicStorage.set(InMemoryKeys.BvDataApp, d.actualStorage);
    } else if (d.avilableFinger && !d.actualStorage) {
      d.actualStorage = new BvDataApp(this.device.uuid, null, FingerStatus.FOR_CONFIG, this.device.model);
      this.ionicStorage.set(InMemoryKeys.BvDataApp, d.actualStorage);
    }
    const page = d.actualStorage.fingerStatus === FingerStatus.FULL ? this.LOGIN_FINGER_PAGE : this.LOGIN_PAGE;
    return Promise.resolve(new DataToLogin(page, d.actualStorage.fingerStatus));
  }

  private async setData(): Promise<InfoDevice> {
    const result: InfoDevice = { avilableFinger: false, actualStorage: null };
    try {
      const typeAvilableFinger = <string>await this.fingerprintAIO.isAvailable();
      result.avilableFinger = (typeAvilableFinger === 'finger' || typeAvilableFinger === 'face');
    } catch (e) {
      result.avilableFinger = false;
    }

    try {
      const storage = await this.ionicStorage.get(InMemoryKeys.BvDataApp);
      result.actualStorage = storage;
    } catch (e) {
      result.actualStorage = null;
    }

    return Promise.resolve(result);

  }
}

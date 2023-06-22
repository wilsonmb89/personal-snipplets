import { Injectable } from '@angular/core';
import { LoginData } from '../../../../app/models/login-data';
import { BdbAnalyticsService } from '@app/shared/utils/bdb-analytics-service/bdb-analytics.service';

@Injectable()
export class InitializeAppDelegateService {

  constructor(
    private bdbAnalyticsService: BdbAnalyticsService
  ) {
  }

  public launchMaster(loginData: LoginData): void {
    if (!!loginData) {
      this.setUserHashForDatalayer(loginData);
    }
  }

  private setUserHashForDatalayer(loginData: LoginData): void {
    if (!!loginData.identificationType && !!loginData.identificationNumber ) {
      this.bdbAnalyticsService.pushAnalyticsUserInfo(
        loginData.identificationType,
        loginData.identificationNumber.toString()
      );
    }
  }

}

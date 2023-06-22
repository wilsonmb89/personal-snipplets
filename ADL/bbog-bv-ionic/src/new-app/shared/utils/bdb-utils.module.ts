import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BdbCypherService } from './bdb-cypher-service/bdb-cypher.service';
import { BdbAnalyticsService } from './bdb-analytics-service/bdb-analytics.service';
import { LoadScriptService } from './bdb-load-script-service/load-script.service';
import { BdbStorageService } from './bdb-storage-service/bdb-storage.service';
import { BdbAppVersionService } from './bdb-app-version-service/bdb-app-version.service';
import { BdbLoaderService } from './bdb-loader-service/loader.service';
import {BalanceUtilsService} from '@app/shared/utils/bdb-balance-utils/balance-utils.service';
import { FingerPrintService } from '@app/shared/utils/bdb-finger-print-service/finger-print.service';


@NgModule({
  declarations: [],
  imports: [
    HttpClientModule

  ],
  providers: [
    LoadScriptService,
    BdbAnalyticsService,
    BdbCypherService,
    BdbStorageService,
    BdbAppVersionService,
    BdbLoaderService,
    BalanceUtilsService,
    FingerPrintService
  ]
})
export class BdbUtilsModule {
}

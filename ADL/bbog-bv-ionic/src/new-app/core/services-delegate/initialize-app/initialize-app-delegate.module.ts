import { InitializeAppDelegateService } from './initialize-app-delegate.service';
import { NgModule } from '@angular/core';
import { AppCoreApisModule } from '../../services-apis/app-core/app-core-apis.module';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import {ValidationApiService} from '../../services-apis/identity-validation/validation-api.service';


@NgModule({
  declarations: [],
  imports: [
    AppCoreApisModule,
    BdbUtilsModule
  ],
  providers: [
    InitializeAppDelegateService,
    ValidationApiService
  ]
})
export class InitializeAppDelegateModule {
}

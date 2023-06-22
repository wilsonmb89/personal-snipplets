import { NgModule } from '@angular/core';

import { AppCoreApisModule } from '@app/apis/app-core/app-core-apis.module';
import { ValidationApiService } from '@app/apis/identity-validation/validation-api.service';
import { BdbUtilsModule } from '@app/shared/utils/bdb-utils.module';
import { GenerateAccessTokenDelegateService } from './generate-access-token-delegate.service';
import {DispatcherDelegateService} from './dispatcher-delegate.service';

@NgModule({
  declarations: [],
  imports: [
    AppCoreApisModule,
    BdbUtilsModule
  ],
  providers: [
    GenerateAccessTokenDelegateService,
    ValidationApiService,
    DispatcherDelegateService
  ]
})
export class IdentityValidationDelegateModule {
}

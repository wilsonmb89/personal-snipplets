import { NgModule } from '@angular/core';
import {BdbAuthenticationPagesModule} from '@app/modules/authentication/pages/pages.module';
import {BdbAuthenticationServicesModule} from '@app/modules/authentication/services/services.module';
import {AuthStoreModule} from '@app/modules/authentication/store/auth-store.module';

@NgModule({
  imports: [
  BdbAuthenticationPagesModule,
  BdbAuthenticationServicesModule,
  AuthStoreModule
  ],
})
export class BdbAuthenticationModule {}

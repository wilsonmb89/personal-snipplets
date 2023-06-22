import { NgModule } from '@angular/core';
import { BdbHttpModule } from '../../http/bdb-http.module';
import { SecurityApiService } from './security/security-api.service';
import { BdbSecurityModule } from '../../../shared/security/bdb-security.module';


@NgModule({
  declarations: [],
  imports: [BdbHttpModule, BdbSecurityModule],
  providers: [
    SecurityApiService
  ]
})
export class AppCoreApisModule {
}

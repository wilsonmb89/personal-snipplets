import { NgModule } from '@angular/core';

import { BdbHttpModule } from '../../http/bdb-http.module';
import { CustomerSecurityService } from './customer-security.service';

@NgModule({
  declarations: [],
  imports: [
    BdbHttpModule
  ],
  providers: [
    CustomerSecurityService
  ]
})
export class CustomerSecurityModule {}

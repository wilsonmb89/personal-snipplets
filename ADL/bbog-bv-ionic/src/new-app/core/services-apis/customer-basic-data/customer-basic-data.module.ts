import { NgModule } from '@angular/core';

import { BdbHttpModule } from '../../http/bdb-http.module';
import { CustomerBasicDataService } from './customer-basic-data.service';

@NgModule({
  declarations: [],
  imports: [
    BdbHttpModule
  ],
  providers: [
    CustomerBasicDataService
  ]
})
export class CustomerBasicDataModule {}

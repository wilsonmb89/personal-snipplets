import { NgModule } from '@angular/core';

import { CustomerBasicDataModule } from '@app/apis/customer-basic-data/customer-basic-data.module';
import { EmailNotificationDelegateService } from './email-notification-delegate.service';
import { GetAllBasicDataDelegateService } from './get-all-delegate.service';
import { UpdateBasicDataService } from './update-basic-data.delegate.service';

@NgModule({
  imports: [
    CustomerBasicDataModule
  ],
  providers: [
    GetAllBasicDataDelegateService,
    UpdateBasicDataService,
    EmailNotificationDelegateService
  ]
})
export class CustomerBasicDataDelegateModule { }

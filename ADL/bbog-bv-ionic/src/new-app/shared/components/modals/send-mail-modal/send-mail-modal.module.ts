import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PulseModalControllerProvider } from '../../../../../providers/pulse-modal-controller/pulse-modal-controller';
import { PulseToastService } from '../../pulse-toast/provider/pulse-toast.service';
import { SendMailModalComponent } from './components/main-component/send-mail-modal';
import { SendMailModalService } from './services/send-mail-modal.service';
import { EmailProvider } from '../../../../../providers/messenger';
import { CustomerBasicDataDelegateModule } from '@app/delegate/customer-basic-data-delegate/customer-basic-data-delegate.module';

@NgModule({
  declarations: [SendMailModalComponent],
  providers: [
    SendMailModalService,
    PulseModalControllerProvider,
    PulseToastService,
    EmailProvider
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerBasicDataDelegateModule
  ],
  entryComponents: [SendMailModalComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SendMailModalModule { }

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorModalComponent } from './components/error-modal/error-modal';
import { ServiceApiErrorModalService } from './provider/service-api-error-modal.service';

@NgModule({
  declarations: [
    ErrorModalComponent
  ],
  providers: [
    ServiceApiErrorModalService
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [
    ErrorModalComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ServiceApiErrorModalModule { }

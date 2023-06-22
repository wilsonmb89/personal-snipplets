import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenericModalComponent } from './components/main-component/generic-modal';
import { GenericModalService } from './provider/generic-modal.service';
import { AdditionalInfoComponent } from './components/additional-info/additional-info';


@NgModule({
  declarations: [
    GenericModalComponent,
    AdditionalInfoComponent
  ],
  providers: [
    GenericModalService
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [
    GenericModalComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class GenericModalModule { }

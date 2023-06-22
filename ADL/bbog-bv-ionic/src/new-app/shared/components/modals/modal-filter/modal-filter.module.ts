import {NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ModalFilterComponent} from './modal-filter';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../../../../app/core/core.module';

@NgModule({
  declarations: [
    ModalFilterComponent
  ],
  exports: [
    ModalFilterComponent,
  ],
  imports: [
    CommonModule,
    CoreModule
  ],
  entryComponents: [
    ModalFilterComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ModalFilterModule {
}

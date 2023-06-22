import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {PocketExceedMaxComponent} from './pocket-exceed-max/pocket-exceed-max';
import {PocketSameCategoryComponent} from './pocket-same-category/pocket-same-category';
import {PocketConfirmDeleteComponent} from './pocket-confirm-delete/pocket-confirm-delete';
@NgModule({
  declarations: [
    PocketConfirmDeleteComponent,
    PocketExceedMaxComponent,
    PocketSameCategoryComponent,
  ],
  exports: [
    PocketConfirmDeleteComponent,
    PocketExceedMaxComponent,
    PocketSameCategoryComponent
  ],
  entryComponents: [
    PocketConfirmDeleteComponent,
    PocketExceedMaxComponent,
    PocketSameCategoryComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PocketsModalsModule {}

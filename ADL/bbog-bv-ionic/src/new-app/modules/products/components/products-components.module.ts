import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ToggleComponentModule } from '@app/shared/components/toggle/toggle.module';
import { BdbCdtRenovationCardComponent } from './bdb-cdt-renovation-card/bdb-cdt-renovation-card.component';
import { SetPinCardComponent } from './set-pin-card/set-pin-card.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BdbCdtRenovationCardComponent,
    SetPinCardComponent
  ],
  exports: [
    BdbCdtRenovationCardComponent,
    SetPinCardComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    ToggleComponentModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ProductsComponentsModule {}

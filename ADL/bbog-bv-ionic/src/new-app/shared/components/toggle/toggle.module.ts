import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ToggleComponent } from './toggle';


@NgModule({
  declarations: [
    ToggleComponent
  ],
  exports: [
    ToggleComponent
  ],
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ToggleComponentModule {}

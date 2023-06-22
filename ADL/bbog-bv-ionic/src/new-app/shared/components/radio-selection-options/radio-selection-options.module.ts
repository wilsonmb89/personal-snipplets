import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { RadioSelectionOptionsComponent } from './radio-selection-options';

@NgModule({
  declarations: [
    RadioSelectionOptionsComponent
  ],
  exports: [
    RadioSelectionOptionsComponent
  ],
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class RadioSelectionOptionsComponentModule {}

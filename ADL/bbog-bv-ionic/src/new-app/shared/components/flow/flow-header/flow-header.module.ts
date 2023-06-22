import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { FlowHeaderComponent } from './flow-header';

@NgModule({
  declarations: [
    FlowHeaderComponent
  ],
  exports: [
    FlowHeaderComponent
  ],
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class FlowHeaderComponentModule {}

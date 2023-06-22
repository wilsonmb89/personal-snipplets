import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CreditCardComponent } from './credit-card';

@NgModule({
  declarations: [
    CreditCardComponent
  ],
  exports: [
    CreditCardComponent
  ],
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class CreditCardComponentModule {}
